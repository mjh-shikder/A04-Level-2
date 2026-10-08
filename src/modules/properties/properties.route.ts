import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { UserRole } from "../../../generated/prisma/client";
import { propertyController } from "./properties.controller";

const router = Router()

router.post("/landlord/properties", auth(UserRole.LANDLORD, UserRole.ADMIN), propertyController.createProperty);


export const propertiesRouter = router;