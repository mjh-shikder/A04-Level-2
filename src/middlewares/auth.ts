import { NextFunction, Request, Response } from "express";
import { UserRole, UserStatus } from "../../generated/prisma/client";
import { verifyToken } from "../utils/jwt";
import config from "../config";
import { prisma } from "../lib/prisma";
import { IAuthUser } from "../types/express";
import { catchAsync } from "../utils/catchAsync";
import { JwtPayload } from "jsonwebtoken";



export const auth = (...roles: UserRole[]) => { 

    return catchAsync(async (req: Request, res: Response, next: NextFunction) => { 
       

        const token = req.cookies.accessToken
          ? req.cookies.accessToken
          : req.headers.authorization?.startsWith("Bearer ")
          ? req.headers.authorization?.split(" ")[1]
          : req.headers.authorization;


        if (!token) { 
            throw new Error("Youre not logged in! Please log in to get access.");
        }  

        const verifiedToken = verifyToken(token, config.jwt.secret) as IAuthUser;

       
        const {id} = verifiedToken as JwtPayload

        //* checking if user exist in db and also is the user is active
        const user = await prisma.user.findUnique({
          where: { id },
        });

        if (!user) {
          throw new Error("User not found! Please Log in and try again");
        }

        if (user.status === UserStatus.BLOCKED) {
           throw new Error("Your account has been blocked by Admin");
        }

     

        req.user = {
          userId: user.id,
          email: user.email,
          role: user.role,
          status: user.status,
        };

        next();

    }) 
}