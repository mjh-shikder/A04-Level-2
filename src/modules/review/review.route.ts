import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { UserRole } from "../../../generated/prisma/browser";
import { reviewController } from "./review.controller";

const router = Router()

router.post("/create", auth(UserRole.TENANT), reviewController.createReview)

export const reviewRouter = router;