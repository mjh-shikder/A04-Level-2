import { prisma } from "../../lib/prisma";

const getAllUsers = async () => { 

    const allUsers = await prisma.user.findMany()

    return allUsers
}


export const adminService = {
    getAllUsers,

}