import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";


const createPayment = catchAsync(async (req: Request, res: Response) => { 

})


export const paymentController = {
    createPayment,
    
}