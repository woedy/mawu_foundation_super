import express from "express";
import { body } from "express-validator";
import { paymentController } from "./payment.controller";
import { validate } from "../../middleware/validate-request";

const router = express.Router();

router.post(
  "/intent",
  validate([
    body("amount")
      .isNumeric()
      .withMessage("Amount must be a number")
      .custom((value: number) => Number(value) > 0)
      .withMessage("Amount must be greater than zero"),
    body("currency")
      .optional()
      .isString()
      .withMessage("Currency must be a string")
      .isLength({ min: 3, max: 3 })
      .withMessage("Currency must be a 3-letter ISO code"),
    body("metadata")
      .optional()
      .isObject()
      .withMessage("Metadata must be an object"),
    body("paymentMethodTypes")
      .optional()
      .isArray()
      .withMessage("Payment method types must be an array"),
    body("customerEmail")
      .optional()
      .isEmail()
      .withMessage("Must be a valid email"),
    body("description")
      .optional()
      .isString()
      .withMessage("Description must be a string"),
  ]),
  paymentController.createPaymentIntent.bind(paymentController),
);

router.post(
  "/webhook",
  paymentController.handleWebhook.bind(paymentController),
);

router.get(
  "/methods",
  paymentController.getPaymentMethods.bind(paymentController),
);

export { router as paymentRoutes };
