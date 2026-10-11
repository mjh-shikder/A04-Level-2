import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { UserRole } from "../../../generated/prisma/client";
import { rentalRequestController } from "./rentalRequest.controller";


const router = Router()

router.post("/create-request", auth(UserRole.TENANT), rentalRequestController.createRentalRequest)

router.get("/tenant-requests", auth(UserRole.TENANT), rentalRequestController.getTenantRentalRequests)


export const rentalRequestRouter = router