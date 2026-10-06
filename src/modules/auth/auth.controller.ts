import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import bcrypt from "bcryptjs";
import config from "../../config";
import httpstatus from "http-status";
import { authService } from "./auth.service";

const registerUser = async (req: Request, res: Response) => {
  try {
      const payload = req.body;

      const user = await authService.registerUserIntoDB(payload);

      res.status(httpstatus.CREATED).json({
        message: "User registered successfully",
        data: user,
      });
  } catch (error) {
      console.log(error);
      res.status(httpstatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal server error",
      error: (error as Error).message,
    });
    
  }
};


export const authController = {
  registerUser,
};