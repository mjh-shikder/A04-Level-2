import { UserRole } from "../../../generated/prisma/client";

export interface IRegisterUserPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
  avatar?: string;
  role?: "LANDLORD" | "TENANT";
}


export interface ILoginUser { 
  email: string;
  password: string;
}