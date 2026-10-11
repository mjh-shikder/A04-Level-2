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


//* get rental request details by rental request id
const getRentalRequestById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (typeof id !== "string") {
    throw new Error("Rental request ID is not valid");
  }

  const user = req.user;

  if (!user) {
    throw new Error("Unauthorized");
  }

  const result = await rentalRequestService.getRentalRequestById(id, user.userId, user.role);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Rental request Retrieved successfully",
    data: result,
  });
});


export const rentalRequestController = {
  createRentalRequest,
  getTenantRentalRequests,
  getRentalRequestById,
  
};