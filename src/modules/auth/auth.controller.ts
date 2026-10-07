import { NextFunction, Request, RequestHandler, Response } from "express";
import { prisma } from "../../lib/prisma";
import bcrypt from "bcryptjs";
import config from "../../config";
import httpstatus from "http-status";
import { authService } from "./auth.service";

const catchAsync = (fn: RequestHandler) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      console.log(error);
      res.status(httpstatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Internal server error",
        error: (error as Error).message,
      });
    }
  };
};

// const registerUser = async (req: Request, res: Response) => {
//   try {
//     const payload = req.body;

//     const user = await authService.registerUserIntoDB(payload);

//     res.status(httpstatus.CREATED).json({
//       message: "User registered successfully",
//       data: user,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(httpstatus.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       message: "Internal server error",
//       error: (error as Error).message,
//     });
//   }
// };

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

export const authController = {
  registerUser,
};
