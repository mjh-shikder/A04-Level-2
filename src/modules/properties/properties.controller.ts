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


//* Delete Property 
const deleteProperty = catchAsync(async (req: Request, res: Response) => { 

    const { id } = req.params

    if (typeof id !== "string") {
      throw new Error("Property ID is not valid");
    }

    const result = await propertyService.deleteProperty(id, req.user!.userId, req.user!.role)

      sendResponse(res, {
        success: true,
        statusCode: httpstatus.OK,
        message: "Property Deleted Successfully",
        data: null,
      });

})


// * Get LandLord Properties with rental reques and review
const getLandLordProperties = catchAsync(async (req: Request, res: Response) => { 

    const result = await propertyService.getLandlordProperties(req.user!.userId)

    sendResponse(res, {
        success: true,
        statusCode: httpstatus.OK,
        message: 'Landlord properties retrived successfully',
        data: result,
    })

})


// * Get All Properties
const getAllProperties = catchAsync(async (req: Request, res: Response) => { 

    const query = req.query 

    const result = await propertyService.getAllProperties(query)

   sendResponse(res, {
   success: true,
   statusCode: httpstatus.OK,
   message: "Landlord properties retrived successfully",
   meta: result.meta,
   data: result.data,
 });


})


// * Get Detailed Property by property Id
const getPropertyById = catchAsync(async (req: Request, res: Response) => { 

    const { id } = req.params

    if (typeof id !== "string") {
        throw new Error("enter a valid property ID ")
    }

    const result = await propertyService.getPropertyById(id)

    sendResponse(res, {
        success: true,
        statusCode: httpstatus.OK,
        message: "Property Retrived successfully",
        data: result
    })
})

export const propertyController = {
    createProperty,
    updateProperty,
    deleteProperty,
    getLandLordProperties,
    getAllProperties,
    getPropertyById,
  
};
