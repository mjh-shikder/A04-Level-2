import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import httpStatus from "http-status";
import { paymentService } from "./payment.service";
import { sendResponse } from "../../utils/sendResponse";
import { UserRole } from "../../../generated/prisma/client";

const createPayment = catchAsync(async (req: Request, res: Response) => { 

 const userId = req.user?.userId as string;


 const result = await paymentService.createPayment(userId, req.body);

 sendResponse(res, {
   success: true,
   statusCode: httpStatus.CREATED,
   message: "Payment session created successfully",
   data: result,
 });
})


// * Confinr payment Stripe webhook 
const confirmPayment = catchAsync(async (req: Request, res: Response) => { 

    const signature = req.headers["stripe-signature"] as string;

    if (!signature) { 
        throw new Error ("Missing Stripe Signature Header")
    }

    const result = await paymentService.confirmPayment(req.body, signature)

     sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: result.message,
        data: result,
    });

})


//* Get Payment History
const getPaymentHistory = catchAsync(async (req: Request, res: Response) => {

    const userId = req.user?.userId as string
    const role = req.user?.role as UserRole

    const result = await paymentService.getPaymentHistory(userId, role)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Payment history retrieved successfully",
        data: result,
    });
 })

export const paymentController = {
    createPayment,
    confirmPayment,
    getPaymentHistory,
}