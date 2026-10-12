import { UserStatus } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

// * Get all users
const getAllUsers = async () => { 

    const allUsers = await prisma.user.findMany()

    return allUsers
}


// * Get all properties
const getAllProperties = async () => { 

    const allProperties = await prisma.property.findMany()

    return allProperties

}


// * Get all Rental request 
const getAllRentalRequest = async () => { 

    const allRentalRequests = await prisma.rentalRequest.findMany()

    return allRentalRequests

}

//* Block or Unblock users 
const updateUserStatus = async (id: string, status: UserStatus) => { 

    const user = await prisma.user.findUnique({
        where: {id}
    })

    if (!user) { 
        throw new Error("User Not Found!")
    }

    const updateStatus = await prisma.user.update({
      where: { id: user.id },
      data: {status},
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        avatar: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return updateStatus

}

export const adminService = {
    getAllUsers,
    getAllProperties,
    getAllRentalRequest,
    updateUserStatus
}