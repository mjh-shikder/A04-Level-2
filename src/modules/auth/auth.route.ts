import { Router } from "express";
import { authController } from "./auth.controller";

const router = Router();

router.post("/register", authController.registerUser);

router.post("/login", authController.login)


export const userRouter = router;