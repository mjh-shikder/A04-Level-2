import { UserRole } from "../../../generated/prisma/client";

export interface RegisterUserPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
  avatar?: string;
  role?: UserRole;
}


export interface ILoginUser { 
  email: string;
  password: string;
}