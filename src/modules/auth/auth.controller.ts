import { NextFunction, Request, RequestHandler, Response } from "express";
import { prisma } from "../../lib/prisma";
import bcrypt from "bcryptjs";
import config from "../../config";
import httpstatus from "http-status";
import { authService } from "./auth.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

//* Creating New User
const registerUser = catchAsync(
  async (req: Request, res: Response) => {
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
  const {user, accessToken} = await authService.loginUser(payload);


  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: false,
    sameSite: "none",
    maxAge: 1000 * 60 * 60 * 24 * 30 
  });


    res.status(httpstatus.OK).json({
        message: "user logged in successfully",
      data: {
        user,
        accessToken
      }
    })
    
});


//* Get Current authenticated user
const getMe = catchAsync(async (req: Request, res: Response) => {
    const userId = req.body.userId
    const result = await authService.getMe(userId);

  

    sendResponse(res, {
        statusCode: httpstatus.OK,
        success: true,
        message: "Profile retrived successfully",
        data: result
    })

})




export const authController = {
  registerUser,
    login,
    getMe,
};
