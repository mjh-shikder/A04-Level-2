import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { UserRole } from "../../../generated/prisma/client";
import { propertyController } from "./properties.controller";

const router = Router()

router.post("/landlord/properties", auth(UserRole.LANDLORD, UserRole.ADMIN), propertyController.createProperty);

router.put("/landlord/properties/:id", auth(UserRole.ADMIN, UserRole.LANDLORD), propertyController.updateProperty);

router.delete("/landlord/properties/:id", auth(UserRole.LANDLORD, UserRole.ADMIN), propertyController.deleteProperty);

router.get("/landlord/properties", auth(UserRole.LANDLORD), propertyController.getLandLordProperties);

router.get("/all/properties", auth(UserRole.ADMIN), propertyController.getAllProperties)

export const propertiesRouter = router;