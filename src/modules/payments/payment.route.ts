import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { UserRole } from "../../../generated/prisma/client";
import { paymentController } from "./payment.controller";

const router = Router();

router.post("/create", auth(UserRole.TENANT), paymentController.createPayment)


export const paymentRouter = router;
