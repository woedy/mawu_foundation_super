import { z } from "zod";

export const paymentMethodSchema = z.enum([
  "card",
  "mobile_money",
  "bank_transfer",
  "paypal",
  "crypto",
]);

export type PaymentMethod = z.infer<typeof paymentMethodSchema>;

const currencySchema = z
  .string()
  .min(3, "Currency must be a 3-letter ISO code")
  .max(3, "Currency must be a 3-letter ISO code")
  .transform((value) => value.toUpperCase());

export const createPaymentIntentSchema = z.object({
  amount: z.coerce.number().gt(0, "Amount must be positive"),
  currency: currencySchema.default("GHS"),
  metadata: z.record(z.string()).optional(),
  paymentMethodTypes: z.array(paymentMethodSchema).default(["card"]),
  customerEmail: z.string().email("Invalid email format").optional(),
  description: z.string().optional(),
});

export const webhookEventSchema = z.object({
  type: z.string(),
  data: z.object({
    object: z.record(z.any()),
  }),
});
