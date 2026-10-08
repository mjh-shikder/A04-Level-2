import { PropertyStatus, UserRole } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { ICreateProperty } from "../../types/type";

const createProperty = async (payload: ICreateProperty, requesterRole: string) => {
  const category = await prisma.category.findUnique({
    where: { id: payload.categoryId },
  });

  if (!category) {
    throw new Error("Category not found!");
    }

    if (requesterRole === UserRole.TENANT) { 
        throw new Error ("Teants Cannot Create Property")
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


export const propertyService = {
    createProperty,
    
}