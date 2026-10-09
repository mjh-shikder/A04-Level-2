import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { UserRole } from "../../../generated/prisma/client";
import { rentalRequestController } from "./rentalRequest.controller";


const router = Router()

router.post("/rental-request", auth(UserRole.TENANT), rentalRequestController.createRentalRequest)


export const rentalRequestRouter = router