import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { adminService } from "./admin.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";



//* Get All user 
const getAllUsers = catchAsync(async (req: Request, res: Response) => { 

    const result = await adminService.getAllUsers()

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Retrived All Users Successfully",
        data: result
    })

})


// * Get all properties
const getAllProperties = catchAsync(async (req: Request, res: Response) => { 

  const result = await adminService.getAllProperties();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Retrived All Properties Successfully",
    data: result,
  });

})


// * Get all rental requests
const getAllRentalRequests = catchAsync(async (req: Request, res: Response) => { 
    
  const result = await adminService.getAllRentalRequest();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Retrived All Rental Requests Successfully",
    data: result,
  });
})


// * Block or Unblock user 
const updateUserStatus = catchAsync(async (req: Request, res: Response) => {

    const { id } = req.params
    
    const status = req.body.status 

    
    if (typeof id !== 'string') { 
        throw new Error ("Provide a valid User Id")
    }


    const result = await adminService.updateUserStatus(id, status)

      sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Update User Status Successfully",
        data: result,
      });

});

export const adminController = {
    getAllUsers,
    getAllProperties,
    getAllRentalRequests,
    updateUserStatus
}