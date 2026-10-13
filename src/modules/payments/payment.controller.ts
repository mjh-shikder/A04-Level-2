import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import httpStatus from "http-status";
import { paymentService } from "./payment.service";
import { sendResponse } from "../../utils/sendResponse";

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


export const paymentController = {
    createPayment,

}