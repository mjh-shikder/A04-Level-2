import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });


export default {
  port: process.env.PORT || 5000,
  databaseUrl: process.env.DATABASE_URL,

  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  jwt: {
    secret: process.env.JWT_SECRET || "super_secret_jwt_key_rentnest_project",
    expires_in: process.env.JWT_EXPIRES_IN || "7d",
  },

    backend_base_url: process.env.BACKEND_BASE_URL || "http://localhost:5000",
  app_url: process.env.APP_URL || "http://localhost:3000",
};