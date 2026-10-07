import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import config from "../../config";
import { ILoginUser, RegisterUserPayload } from "./auth.interface";
import { UserStatus } from "../../../generated/prisma/client";
import { createToken } from "../../utils/jwt";
import { SignOptions } from "jsonwebtoken";

//* Creating New User into DB
const registerUserIntoDB = async (payload: RegisterUserPayload) => {
  const { name, email, password, phone, avatar, role } = payload;
  const isUserExist = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (isUserExist) {
    throw new Error("User already exists");
  }

  const hasheddPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_rounds),
  );

  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hasheddPassword,
      phone,
      avatar,
      role,
    },

    omit: {
      password: true,
    },
  });

  return newUser;
};


//* Login  User
const loginUser = async (payload: ILoginUser) => {
  const user = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });

    if (!user) { 
        throw new Error("User Not Found");
    }

    if (user.status === UserStatus.BLOCKED) { 
        throw new Error("Your Account is Blocked, Contact Support.")
    }

    const isPasswordMatch = await bcrypt.compare(payload.password, user.password);

    if (!isPasswordMatch) { 
        throw new Error("Invalid Email or Password");
    }

    const jwtPayload = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
    }

    const accessToken = createToken(jwtPayload, config.jwt.secret, {expiresIn: config.jwt.expires_in as SignOptions["expiresIn"]});

    const { password, ...userWithoutPassword } = user

    return {
        user: userWithoutPassword,
        accessToken
    }

};


//* Get current user 
const getMe = async (userId: string) => { 
    const user = await prisma.user.findUnique({
        where: {
            id: userId
        },

        omit: {
            password: true
        }
        
    });

    if (!user) { 
        throw new Error("User Not Found!");
  }

  if(user.status === UserStatus.BLOCKED) {
    throw new Error("Your Account is Blocked by the Admin, Contact Support.")
  }

    return user;

}



export const authService = {
  registerUserIntoDB,
    loginUser,
  getMe,
};
