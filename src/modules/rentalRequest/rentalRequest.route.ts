import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { UserRole } from "../../../generated/prisma/client";
import { rentalRequestController } from "./rentalRequest.controller";


const router = Router()

router.post("/create-request", auth(UserRole.TENANT), rentalRequestController.createRentalRequest)

router.get("/tenants-requests", auth(UserRole.TENANT), rentalRequestController.getTenantRentalRequests)

router.get("/tenants-requests/:id", auth(UserRole.TENANT), rentalRequestController.getRentalRequestById);

router.get("/landlord/requests", auth(UserRole.LANDLORD), rentalRequestController.getLandlordRentalRequests)

export const rentalRequestRouter = router