import { JwtPayload } from "jsonwebtoken";
import { UserRole, UserStatus } from "../../generated/prisma/client";


export interface IAuthUser extends JwtPayload { 
    userId: string;
    email: string;
    role: UserRole;
    status: UserStatus;
}

declare global {
  namespace Express {
    interface Request {
      user?: IAuthUser;
    }
  }
}
