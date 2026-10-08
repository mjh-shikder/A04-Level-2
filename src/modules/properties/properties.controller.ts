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


    const result = await propertyService.createProperty(payload, requesterRole)


    sendResponse(res, {
        success: true,
        statusCode: httpstatus.OK,
        message: "Property created successfully",
        data: result
    })

});



export const propertyController = {
  createProperty,
};
