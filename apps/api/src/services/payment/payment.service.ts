import Stripe from "stripe";
import { AppEnv } from "@mawu/config";
import { paymentLogger } from "../../utils/logger";
import type { PaymentMethod } from "./payment.schemas";
import { recordPaymentIntentEvent } from "./payment.store";

interface CreatePaymentIntentParams {
  amount: number;
  currency: string;
  metadata?: Record<string, string>;
  paymentMethodTypes?: PaymentMethod[];
  customerEmail?: string;
  description?: string;
}

export class PaymentService {
  private stripe: Stripe | null = null;
  private readonly isEnabled: boolean;
  private readonly webhookSecret?: string;

  constructor(
    private readonly config: {
      stripeSecretKey?: string;
      webhookSecret?: string;
    },
  ) {
    this.isEnabled = Boolean(config.stripeSecretKey);
    this.webhookSecret = config.webhookSecret;

    if (this.isEnabled && config.stripeSecretKey) {
      this.stripe = new Stripe(config.stripeSecretKey, {
        apiVersion: "2023-10-16",
      });
    }
  }

  isConfigured() {
    return this.isEnabled && Boolean(this.stripe);
  }

  async createPaymentIntent(params: CreatePaymentIntentParams) {
    if (!this.isConfigured() || !this.stripe) {
      throw new Error("Payment processing is not configured");
    }

    const amountInMinorUnits = Math.round(params.amount * 100);

    if (!Number.isFinite(amountInMinorUnits) || amountInMinorUnits <= 0) {
      throw new Error("Invalid payment amount supplied");
    }

    const paymentMethodTypes = params.paymentMethodTypes?.length
      ? params.paymentMethodTypes
      : ["card"];
    const unsupportedMethods = paymentMethodTypes.filter(
      (method) => method !== "card",
    );

    if (unsupportedMethods.length > 0) {
      throw new Error(
        `Unsupported payment method(s): ${unsupportedMethods.join(", ")}`,
      );
    }

    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: amountInMinorUnits,
        currency: params.currency.toLowerCase(),
        payment_method_types: ["card"],
        metadata: params.metadata,
        receipt_email: params.customerEmail,
        description: params.description,
      });

      return {
        clientSecret: paymentIntent.client_secret,
        id: paymentIntent.id,
        status: paymentIntent.status,
      };
    } catch (error) {
      paymentLogger.error({ error }, "Error creating payment intent");
      throw new Error("Failed to create payment intent");
    }
  }

  async handleWebhookEvent(payload: string, signature: string) {
    if (!this.isConfigured() || !this.stripe) {
      throw new Error("Payment processing is not configured");
    }

    if (!this.webhookSecret) {
      throw new Error("Stripe webhook secret is not configured");
    }

    try {
      const event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        this.webhookSecret,
      );

      switch (event.type) {
        case "payment_intent.succeeded":
          await this.handlePaymentIntentSucceeded(
            event.data.object as Stripe.PaymentIntent,
          );
          break;
        case "payment_intent.payment_failed":
          await this.handlePaymentIntentFailed(
            event.data.object as Stripe.PaymentIntent,
          );
          break;
        default:
          paymentLogger.info(
            { eventType: event.type },
            "Unhandled Stripe webhook event",
          );
      }

      return { received: true };
    } catch (error) {
      paymentLogger.error({ error }, "Webhook error");
      throw new Error("Webhook error");
    }
  }

  private async handlePaymentIntentSucceeded(
    paymentIntent: Stripe.PaymentIntent,
  ) {
    await recordPaymentIntentEvent(paymentIntent, "payment_intent.succeeded");
    paymentLogger.info(
      { paymentIntentId: paymentIntent.id },
      "PaymentIntent was successful",
    );
  }

  private async handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
    await recordPaymentIntentEvent(
      paymentIntent,
      "payment_intent.payment_failed",
    );
    paymentLogger.error(
      { paymentIntentId: paymentIntent.id },
      "PaymentIntent failed",
    );
  }
}

export let paymentService: PaymentService;

export function initializePaymentService(
  env: Pick<AppEnv, "STRIPE_SECRET_KEY" | "STRIPE_WEBHOOK_SECRET" | "NODE_ENV">,
) {
  paymentService = new PaymentService({
    stripeSecretKey: env.STRIPE_SECRET_KEY,
    webhookSecret: env.STRIPE_WEBHOOK_SECRET,
  });
  return paymentService;
}
