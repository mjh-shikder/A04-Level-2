import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { userService } from "./user.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";


const updateUser = catchAsync(async (req: Request, res: Response) => { 

    const userId = req.user!.userId 

    const result = await userService.updateUser(userId, req.body)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User Updated Successfully",
        data: result
    })

})


export const userController = {
    updateUser
}