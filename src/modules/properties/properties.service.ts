import { PropertyStatus, UserRole, UserStatus } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { ICreateProperty, IUpdateProperty } from "../../types/type";

const createProperty = async (payload: ICreateProperty, requesterRole: string, requesterStatus: string) => {
  const category = await prisma.category.findUnique({
    where: { id: payload.categoryId },
  });

  if (!category) {
    throw new Error("Category not found!");
    }

    if (requesterRole === UserRole.TENANT) { 
        throw new Error ("Teants Cannot Create Property")
    }

    if (requesterStatus === UserStatus.BLOCKED) { 
        throw new Error ("You have been blocked by the Admin")
    }

  const property = await prisma.property.create({
    data: {
      ...payload,
      landlordId: payload.landlordId,
      availableFrom: payload.availableFrom
        ? new Date(payload.availableFrom)
        : new Date(),
      status: PropertyStatus.AVAILABLE,
    },
    include: {
      category: true,
      landlord: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          avatar: true,
        },
      },
    },
  });
  return property;
};


//* Update Property 
const updateProperty = async (id: string, userId: string, userRole: UserRole, payload: IUpdateProperty ) => { 

    const property = await prisma.property.findUniqueOrThrow({
        where: { id }
    });

    if (userRole === UserRole.TENANT) { 
        throw new Error("Youre are not authorized to update property")
    }


    const updateProperty = await prisma.property.update({
        where: { id },
        data: payload,
        include: {
            category: true
        }
    })

    return updateProperty;

}


export const propertyService = {
    createProperty,
    updateProperty,

    
}