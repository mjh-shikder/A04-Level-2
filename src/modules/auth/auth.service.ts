import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import config from "../../config";
import { RegisterUserPayload } from "./auth.interface";



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



export const authService = {
  registerUserIntoDB,
};
