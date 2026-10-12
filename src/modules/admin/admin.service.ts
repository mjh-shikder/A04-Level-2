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

export const adminService = {
    getAllUsers,
    getAllProperties,
    getAllRentalRequest
}