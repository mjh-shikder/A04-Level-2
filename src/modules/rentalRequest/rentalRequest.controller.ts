import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { rentalRequestService } from "./rentalRequest.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

const createRentalRequest = catchAsync(async (req: Request, res: Response) => { 


    const tenantId = req.user?.userId as string

    const payload = req.body

    const result = await rentalRequestService.createRentalRequest(tenantId, payload)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Rental request created successfully",
        data: result
    })

})


export const rentalRequestController = {
    createRentalRequest
}