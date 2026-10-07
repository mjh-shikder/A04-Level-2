import { NextFunction, Request, RequestHandler, Response } from "express";
import { prisma } from "../../lib/prisma";
import bcrypt from "bcryptjs";
import config from "../../config";
import httpstatus from "http-status";
import { authService } from "./auth.service";
import { catchAsync } from "../../utils/catchAsync";

//* Creating New User
const registerUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;

    const user = await authService.registerUserIntoDB(payload);

    res.status(httpstatus.CREATED).json({
      message: "User registered successfully",
      data: user,
    });
  },
);

//* Login User
const login = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
    const result = await authService.loginUser(payload);


    res.status(httpstatus.OK).json({
        message: "user logged in successfully",
        data: result
    })
    
});



export const authController = {
  registerUser,
  login,
};
