import { Response } from "express";


interface IResponse<T> { 
    statusCode: number;
    success: boolean;
    message?: string;
    meta?: {
        page: number;
        limit: number;
        total: number;
        totalPage: number;
    }
    data: T; 
}

export const sendResponse = <T>(res: Response, data: IResponse<T>) => { 

    res.status(data.statusCode).json({
        success: data.success,
        message: data.message || "Operation Successful",
        meta: data.meta,
        data: data.data,
    })
}