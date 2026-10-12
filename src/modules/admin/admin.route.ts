import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { UserRole } from "../../../generated/prisma/client";
import { adminController } from "./admin.controller";

const router = Router()


router.get("/all-users", auth(UserRole.ADMIN), adminController.getAllUsers)




export const adminRouter = router;