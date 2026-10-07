import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { UserRole } from "../../../generated/prisma/client";

const router = Router()

router.post("landlord/properties", auth(UserRole.LANDLORD, UserRole.ADMIN));

export const propertiesRouter = router;