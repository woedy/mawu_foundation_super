import cors from "cors";
import express from "express";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import { loadEnvConfig } from "@mawu/config";
import { programsPayload, programs } from "./data/programs";
import { transparencyResources } from "./data/transparency";
import { recordNewsletterSignup } from "./data/newsletter.store";
import {
  shopCatalogPayload,
  shopPaymentMethods,
  shopProductsById,
  shopProductsBySlug,
} from "./data/shop";
import { paymentRoutes } from "./services/payment/payment.routes";
import {
  initializePaymentService,
  paymentService,
} from "./services/payment/payment.service";
import { logger } from "./utils/logger";

interface RawBodyRequest extends express.Request {
  rawBody?: string;
}

const env = loadEnvConfig({ cwd: process.cwd(), mode: process.env.NODE_ENV });

initializePaymentService(env);

const app = express();
app.use(cors({ origin: env.CLIENT_URL ?? true }));
app.use(
  express.json({
    verify: (req: RawBodyRequest, _res, buf) => {
      if (req.originalUrl.startsWith("/api/payments/webhook")) {
        req.rawBody = buf.toString();
      }
    },
  }),
);

const donationRequestSchema = z.object({
  amount: z.coerce
    .number()
    .positive("Donation amount must be greater than zero."),
  currency: z
    .string()
    .length(3, "Currency must be a 3-letter ISO code.")
    .default("GHS"),
  frequency: z.enum(["once", "monthly"]),
  focusArea: z.string().min(1, "Select a focus area for your contribution."),
  email: z.string().email("Provide a valid email so we can send receipts."),
});

const volunteerRequestSchema = z.object({
  name: z.string().min(2, "Share your full name."),
  email: z.string().email("A valid email helps us follow up."),
  phone: z.string().optional(),
  region: z.string().min(1, "Let us know where you are based."),
  availability: z.string().min(1, "Select your availability."),
  interests: z
    .array(z.string().min(1))
    .min(1, "Choose at least one impact interest."),
  message: z.string().max(2000).optional(),
});

const partnershipRequestSchema = z.object({
  contactName: z.string().min(2, "Add the primary contact name."),
  organisation: z.string().min(2, "Organisation name is required."),
  email: z.string().email("A valid email ensures we can respond promptly."),
  phone: z.string().optional(),
  partnershipType: z.string().min(2, "Select a collaboration track."),
  message: z.string().max(4000).optional(),
});

const newsletterRequestSchema = z.object({
  email: z
    .string()
    .email("Please share a valid email so we can stay in touch."),
  firstName: z.string().min(1).max(80).optional(),
  lastName: z.string().min(1).max(80).optional(),
  interests: z.array(z.string().min(1)).max(8).optional(),
  source: z.string().min(1).max(60).optional(),
  consent: z.boolean().optional().default(true),
});

const paymentMethodOptions = shopPaymentMethods.map((method) => method.id);

const cartItemSchema = z.object({
  productId: z.string().min(1, "Select a valid product."),
  quantity: z
    .number()
    .int("Quantities must be whole numbers.")
    .positive("Add at least one item to your cart."),
});

const checkoutSchema = z.object({
  email: z.string().email("Add the email to receive digital receipts."),
  shippingRegion: z.string().min(2, "Choose a delivery or pickup option."),
  paymentMethod: z.enum(paymentMethodOptions as [string, ...string[]]),
  items: z
    .array(cartItemSchema)
    .min(1, "Add at least one item to your cart before checking out."),
  note: z.string().max(800).optional(),
});

const formatZodError = (error: z.ZodError) =>
  error.issues
    .map((issue) => `${issue.path.join(".") || "root"}: ${issue.message}`)
    .join("; ");

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    environment: env.NODE_ENV,
    stripeConfigured: Boolean(env.STRIPE_SECRET_KEY),
  });
});

app.use("/api/payments", paymentRoutes);

app.get("/programs", (_req, res) => {
  res.json(programsPayload);
});

app.get("/programs/:slug", (req, res) => {
  const program = programs.find((entry) => entry.slug === req.params.slug);

  if (!program) {
    res.status(404).json({ error: "Program not found" });
    return;
  }

  res.json(program);
});

app.get("/transparency/resources", (_req, res) => {
  res.json(transparencyResources);
});

app.get("/shop/catalog", (_req, res) => {
  res.json(shopCatalogPayload);
});

app.get("/shop/products/:slug", (req, res) => {
  const product = shopProductsBySlug.get(req.params.slug);

  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }

  res.json(product);
});

const shippingRates: Record<string, number> = {
  "Ghana - Volta Region Pickup": 0,
  "Ghana - Nationwide Courier": 32,
  "West Africa - Regional Shipping": 68,
  "International - Custom Quote": 0,
};

const computeOrderSummary = (items: z.infer<typeof cartItemSchema>[]) => {
  const lines = items.map((line) => {
    const product = shopProductsById.get(line.productId);
    if (!product) {
      throw new Error(`Unknown product: ${line.productId}`);
    }

    const lineTotal = product.price * line.quantity;

    return {
      product,
      quantity: line.quantity,
      lineTotal,
    };
  });

  const subtotal = lines.reduce((total, line) => total + line.lineTotal, 0);

  return { lines, subtotal };
};

app.post("/shop/checkout", async (req, res) => {
  const parsed = checkoutSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({ message: formatZodError(parsed.error) });
    return;
  }

  const { email, items, shippingRegion, paymentMethod, note } = parsed.data;

  if (paymentMethod !== "stripe") {
    const paymentMethodMeta = shopPaymentMethods.find(
      (method) => method.id === paymentMethod,
    );

    res.status(409).json({
      status: "inactive_payment_method",
      message:
        paymentMethodMeta?.description ??
        "This payment method is not yet active. Please select Stripe to continue.",
    });
    return;
  }

  let orderLines;
  try {
    orderLines = computeOrderSummary(items);
  } catch (error) {
    logger.error(error);
    res.status(400).json({
      message: "One or more items could not be found. Refresh and try again.",
    });
    return;
  }

  const shippingCost = shippingRates[shippingRegion] ?? 0;
  const total = orderLines.subtotal + shippingCost;

  if (!orderLines.lines.length) {
    res.status(400).json({ message: "Your cart is empty." });
    return;
  }

  const unavailableItem = orderLines.lines.find(
    (line) => line.product.inventory <= 0,
  );
  if (unavailableItem) {
    res.status(409).json({
      message: `${unavailableItem.product.name} is currently unavailable. Please remove it to continue.`,
    });
    return;
  }

  logger.info({
    msg: "Merch checkout intent received",
    email,
    shippingRegion,
    paymentMethod,
    itemCount: items.length,
    subtotal: orderLines.subtotal,
    shipping: shippingCost,
    total,
    note,
  });

  if (!env.STRIPE_SECRET_KEY) {
    res.status(202).json({
      status: "pending",
      message:
        "Stripe is not configured in this environment. We have secured your cart and will email a payment link as soon as test mode is enabled.",
      order: {
        currency: shopCatalogPayload.currency,
        subtotal: orderLines.subtotal,
        shipping: shippingCost,
        total,
      },
    });
    return;
  }

  try {
    const metadata = {
      orderReference: randomUUID(),
      shippingRegion,
      note: note ?? "",
      itemCount: String(items.length),
    };

    const result = await paymentService.createPaymentIntent({
      amount: total,
      currency: shopCatalogPayload.currency,
      metadata,
      customerEmail: email,
      description: "Mawu Foundation merchandise order",
    });

    res.json({
      status: result.status,
      message:
        "Stripe payment intent created. Continue in Stripe to complete your order.",
      paymentIntentId: result.id,
      clientSecret: result.clientSecret,
      order: {
        currency: shopCatalogPayload.currency,
        subtotal: orderLines.subtotal,
        shipping: shippingCost,
        total,
        lines: orderLines.lines.map((line) => ({
          productId: line.product.id,
          name: line.product.name,
          quantity: line.quantity,
          unitAmount: line.product.price,
          lineTotal: line.lineTotal,
        })),
      },
    });
  } catch (error) {
    logger.error(error);
    res.status(502).json({
      message:
        "We could not create a payment intent with Stripe at this time. Please try again shortly.",
    });
  }
});

app.post("/donations/checkout", async (req, res) => {
  const parsed = donationRequestSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({ message: formatZodError(parsed.error) });
    return;
  }

  const donation = parsed.data;
  logger.info({
    msg: "Received donation intent",
    focusArea: donation.focusArea,
    frequency: donation.frequency,
    amount: donation.amount,
    currency: donation.currency,
  });

  if (!env.STRIPE_SECRET_KEY) {
    res.status(202).json({
      status: "pending",
      message:
        "Stripe is not configured in this environment. We have recorded your pledge and will email secure payment instructions shortly.",
    });
    return;
  }

  try {
    const metadata = {
      donationFocusArea: donation.focusArea,
      donationFrequency: donation.frequency,
      donationEmail: donation.email,
    };

    const result = await paymentService.createPaymentIntent({
      amount: donation.amount,
      currency: donation.currency,
      metadata,
      customerEmail: donation.email,
      description: "Mawu Foundation donation",
    });

    res.json({
      status: result.status,
      paymentIntentId: result.id,
      clientSecret: result.clientSecret,
      message:
        "Stripe payment intent created. Use the client secret to complete your donation securely.",
    });
  } catch (error) {
    logger.error(error);
    res.status(502).json({
      message:
        "We could not prepare your donation with Stripe right now. Please try again shortly.",
    });
  }
});

app.post("/engage/newsletter", async (req, res) => {
  const parsed = newsletterRequestSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({ message: formatZodError(parsed.error) });
    return;
  }

  const signup = parsed.data;

  if (!signup.consent) {
    res.status(400).json({
      message: "Confirm your consent to receive updates before subscribing.",
    });
    return;
  }

  try {
    const record = await recordNewsletterSignup({
      email: signup.email,
      firstName: signup.firstName,
      lastName: signup.lastName,
      interests: signup.interests ?? ["investor-updates"],
      source: signup.source ?? "web_footer",
      consent: signup.consent,
    });

    logger.info(
      {
        module: "newsletter",
        email: record.email,
        source: record.source,
        interests: record.interests,
      },
      "Newsletter signup recorded",
    );

    res.status(201).json({
      message:
        "Medasi! You are now on the impact update list. Check your inbox for a welcome note soon.",
    });
  } catch (error) {
    logger.error({ err: error }, "Newsletter signup failed");
    res.status(500).json({
      message:
        "We could not add you to the newsletter right now. Please try again shortly.",
    });
  }
});

app.post("/engage/volunteer", (req, res) => {
  const parsed = volunteerRequestSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({ message: formatZodError(parsed.error) });
    return;
  }

  const submission = parsed.data;
  logger.info({
    msg: "Volunteer interest received",
    name: submission.name,
    email: submission.email,
    region: submission.region,
    availability: submission.availability,
    interests: submission.interests,
  });

  res.json({
    message:
      "Medasi! Our mobilisation team will reach out within 48 hours to align your skills with community needs.",
  });
});

app.post("/engage/partnership", (req, res) => {
  const parsed = partnershipRequestSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({ message: formatZodError(parsed.error) });
    return;
  }

  const submission = parsed.data;
  logger.info({
    msg: "Partnership enquiry received",
    contactName: submission.contactName,
    organisation: submission.organisation,
    partnershipType: submission.partnershipType,
  });

  res.json({
    message:
      "Thank you for partnering with us. Expect a discovery call invitation within two business days.",
  });
});

app.use(
  (
    err: unknown,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    logger.error({ err }, "Unhandled API error");
    res.status(500).json({
      success: false,
      error:
        env.NODE_ENV === "production"
          ? "Internal server error"
          : err instanceof Error
            ? err.message
            : "Unknown error",
    });
  },
);

app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: "Not found",
  });
});

const server = app.listen(env.API_PORT, () => {
  logger.info(`API running on port ${env.API_PORT}`);

  if (!env.STRIPE_SECRET_KEY) {
    logger.warn("Stripe is not configured. Payment features will be disabled.");
  }
});

process.on("SIGTERM", () => {
  logger.info("SIGTERM signal received: closing HTTP server");
  server.close(() => {
    logger.info("HTTP server closed");
  });
});

