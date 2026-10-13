import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { userController } from "./user.controller";

const router = Router()


router.patch("/update", auth(), userController.updateUser)


export const userRouter = router