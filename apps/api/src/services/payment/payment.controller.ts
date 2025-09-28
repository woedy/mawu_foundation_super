import type { Request, Response } from "express";
import { ZodError } from "zod";
import { paymentLogger } from "../../utils/logger";
import { paymentService } from "./payment.service";
import { createPaymentIntentSchema } from "./payment.schemas";

interface RawBodyRequest extends Request {
  rawBody?: string;
}

const ACTIVE_PAYMENT_METHODS = new Set(["card"]);

const formatZodError = (error: ZodError) =>
  error.issues
    .map((issue) => `${issue.path.join(".") || "root"}: ${issue.message}`)
    .join("; ");

export class PaymentController {
  async createPaymentIntent(req: Request, res: Response) {
    try {
      const parsed = createPaymentIntentSchema.safeParse(req.body);

      if (!parsed.success) {
        return res.status(400).json({
          success: false,
          error: formatZodError(parsed.error),
        });
      }

      const payload = parsed.data;
      const inactiveMethod = payload.paymentMethodTypes.find(
        (method) => !ACTIVE_PAYMENT_METHODS.has(method),
      );

      if (inactiveMethod) {
        return res.status(409).json({
          success: false,
          error: `${inactiveMethod} payments are not active yet. Please use card via Stripe.`,
        });
      }

      const result = await paymentService.createPaymentIntent(payload);

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      paymentLogger.error({ error }, "Error creating payment intent");

      if (
        error instanceof Error &&
        error.message === "Payment processing is not configured"
      ) {
        return res.status(503).json({
          success: false,
          error: "Stripe is not configured for this environment.",
        });
      }

      return res.status(400).json({
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to create payment intent",
      });
    }
  }

  async handleWebhook(req: Request, res: Response) {
    const signature = req.headers["stripe-signature"] as string | undefined;

    if (!signature) {
      return res.status(400).json({ error: "Missing stripe-signature header" });
    }

    const rawBody = (req as RawBodyRequest).rawBody;

    if (!rawBody) {
      paymentLogger.error("Stripe webhook received without raw body payload");
      return res.status(400).json({ error: "Invalid webhook payload" });
    }

    try {
      await paymentService.handleWebhookEvent(rawBody, signature);
      return res.json({ received: true });
    } catch (error) {
      paymentLogger.error({ error }, "Webhook error");
      return res.status(400).json({
        error: error instanceof Error ? error.message : "Webhook error",
      });
    }
  }

  getPaymentMethods(_req: Request, res: Response) {
    const methods = [
      { id: "card", name: "Credit/Debit Card", active: true },
      { id: "mobile_money", name: "Mobile Money", active: false },
      { id: "bank_transfer", name: "Bank Transfer", active: false },
      { id: "paypal", name: "PayPal", active: false },
      { id: "crypto", name: "Cryptocurrency", active: false },
    ];

    res.json({
      success: true,
      data: methods,
    });
  }
}

export const paymentController = new PaymentController();
