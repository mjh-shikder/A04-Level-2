import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { reviewService } from "./review.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

const createReview = catchAsync(async (req: Request, res: Response) => { 

    const tenantId = req.user?.userId

    if (typeof tenantId !== 'string') {
        throw new Error ("Tenant Id is not valid")
    }

    const payload = req.body

    const result = await reviewService.createReview(tenantId, payload)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Review created successfully",
        data: result
    })

})


export const reviewController = {
    createReview, 

}