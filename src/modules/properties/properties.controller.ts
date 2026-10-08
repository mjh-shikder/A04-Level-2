import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { propertyService } from "./properties.service";
import { sendResponse } from "../../utils/sendResponse";
import httpstatus from "http-status";

//* Lanlord Creating New Property 
const createProperty = catchAsync(async (req: Request, res: Response) => {
   

    const payload = req.body

    console.log(payload, "payload out put check");


    const requesterRole = req.user?.role as string
    const requesterStatus = req.user?.status as string


    const result = await propertyService.createProperty(payload, requesterRole, requesterStatus)


    sendResponse(res, {
        success: true,
        statusCode: httpstatus.OK,
        message: "Property created successfully",
        data: result
    })

});


// * Update Property 
const updateProperty = catchAsync(async (req: Request, res: Response) => { 

    const { id } = req.params

    if (typeof id !== "string") {
        throw new Error("Property ID is not valid")
    }

    const result = await propertyService.updateProperty(id, req.user!.userId, req.user!.role, req.body)


     sendResponse(res, {
       success: true,
       statusCode: httpstatus.OK,
       message: "Property Updatede Successfully",
       data: result,
     });


})


export const propertyController = {
    createProperty,
  updateProperty,
};
