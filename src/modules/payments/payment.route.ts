import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { UserRole } from "../../../generated/prisma/client";
import { paymentController } from "./payment.controller";
import express from "express";

const router = Router();

router.post("/create", auth(UserRole.TENANT), paymentController.createPayment);

export const paymentRouter = router;

// * Webhook
const webhookRouter = Router();

webhookRouter.post(
  "/confirm",
  express.raw({ type: "application/json" }),
  paymentController.confirmPayment,
);

export const paymentWebhookRouter = webhookRouter;
