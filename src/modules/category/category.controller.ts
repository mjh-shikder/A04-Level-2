import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { categoryService } from "./category.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

const getAllCategory = catchAsync(async (req: Request, res: Response) => { 

    const result = await categoryService.getAllCategory()

    sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "All categories retrieved successfully",
    data: result
    })

})



export const categoryController = {
    getAllCategory,

}