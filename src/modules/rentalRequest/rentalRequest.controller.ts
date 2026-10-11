import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { rentalRequestService } from "./rentalRequest.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";


// * Creaeting Rental Request
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


//* Get Tenant Rental Requests
const getTenantRentalRequests = catchAsync(
    async (req: Request, res: Response) => {
    
        const tenantId = req.user?.userId as string;

    const result = await rentalRequestService.getTenantRentalRequests(tenantId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "My rental requests retrived successfully",
      data: result,
    });
  },
);

export const rentalRequestController = {
  createRentalRequest,
  getTenantRentalRequests,
};