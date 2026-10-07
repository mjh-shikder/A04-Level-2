import { Router } from "express";
import { authController } from "./auth.controller";
import { auth } from "../../middlewares/auth";

const router = Router();

router.post("/register", authController.registerUser);

router.post("/login", authController.login)

router.get("/me",auth() ,authController.getMe)


export const userRouter = router;