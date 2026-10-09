import { RentalStatus } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createRentalRequest = async (tenantId: string, payload: {
    propertyId: string;
    startDate: Date;
    endDate: Date;
    message: string;
}) => { 

    const property = await prisma.property.findUnique({
        where: {
            id: payload.propertyId
        }
    })

    if(!property) {
        throw new Error("Property not found")
    }

    if(property.status !== "AVAILABLE") {
        throw new Error("Property is not available for rent")
    }

    if (property.landlordId === tenantId) {
      throw new Error("You cannot request to rent your own property");
    }

    // checking if the teant alrady has a pending or active request for this property 
    const existingActiveRequest = await prisma.rentalRequest.findFirst({
      where: {
          tenantId,
          propertyId: payload.propertyId,
          status: {
            in: [RentalStatus.PENDING, RentalStatus.APPROVED, RentalStatus.ACTIVE, RentalStatus.PAID]
          }
      },
    });

    if(existingActiveRequest) {
        throw new Error("You already have an active or pending rental request for this property");
    }

    const startDate = new Date(payload.startDate);
    let endDate: Date | null = payload.endDate ? new Date(payload.endDate) : null;
    let totalAmount = Number(property.rent);

    if (endDate) {
        if (endDate <= startDate) {
            throw new Error("End date must be after start date");
        }

    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    const months = Math.max(1, Math.round(diffDays / 30));
    totalAmount = Number(property.rent) * months;
    }


      const rentalRequest = await prisma.rentalRequest.create({
        data: {
          tenantId,
          propertyId: property.id,
          landlordId: property.landlordId,
          startDate,
          endDate,
          message: payload.message,
          monthlyRent: property.rent,
          totalAmount,
          status: RentalStatus.PENDING,
        },
        include: {
          property: {
            select: {
              id: true,
              title: true,
              rent: true,
              address: true,
              city: true,
              images: true,
            },
          },
        },
      });
    
      return rentalRequest;

}



export const rentalRequestService = {
    createRentalRequest,

}