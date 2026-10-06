import cookieParser from "cookie-parser";
import express, { Application, Request, Response } from "express";
import cors from "cors";
import config from "./config";
import { prisma } from "./lib/prisma";
import httpstatus from "http-status";
import bcrypt from "bcryptjs";

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

app.post("/api/auth/register", async (req: Request, res: Response) => { 

    const { name, email, password, phone, avatar, role } = req.body;
    
    const isUserExist = await prisma.user.findUnique({
        where: {
            email,
        }
    });

    if (isUserExist) {
        throw new Error("User already exists");
    }

    const hasheddPassword = await bcrypt.hash(password, Number(config.bcrypt_salt_rounds));

    const newUser = await prisma.user.create({
        data: {
            name,
            email,
            password: hasheddPassword,
            phone,
            avatar,
            role,
        },

        
    })

    console.log(newUser);
    




    res.status(httpstatus.CREATED).json({
        message: "User registered successfully",
        data: newUser,
     });
    
})

export default app; 