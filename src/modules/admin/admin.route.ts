import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { UserRole } from "../../../generated/prisma/client";
import { adminController } from "./admin.controller";

const router = Router()

router.use(auth(UserRole.ADMIN))

router.get("/all-users", adminController.getAllUsers)

router.get("/all-properties", adminController.getAllProperties)

router.get("/all-rentals", adminController.getAllRentalRequests)

router.patch("/users/:id", adminController.updateUserStatus)


export const adminRouter = router;