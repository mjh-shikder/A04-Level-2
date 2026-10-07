import cookieParser from "cookie-parser";
import express, { Application, Request, Response } from "express";
import cors from "cors";
import config from "./config";
import { prisma } from "./lib/prisma";
import httpstatus from "http-status";
import bcrypt from "bcryptjs";
import { userRouter } from "./modules/auth/auth.route";
import { propertiesRouter } from "./modules/properties/properties.route";

const app: Application = express();

app.use(cors({
    origin: config.app_url,
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.get("/", (req: Request, res: Response) => {
    res.send("hello, world")
})

app.use("/api/auth", userRouter);

app.use("/api", propertiesRouter);

export default app; 