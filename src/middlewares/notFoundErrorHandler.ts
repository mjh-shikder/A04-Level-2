import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";

export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
    res.status(httpStatus.NOT_FOUND).json({
        success: false,
        statusCode: httpStatus.NOT_FOUND,
        message: `Not Found - ${req.method} ${req.originalUrl}`,
    });
};
