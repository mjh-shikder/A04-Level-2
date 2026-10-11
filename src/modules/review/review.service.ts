import { RentalStatus } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { ICreateReviewPayload } from "../../types/type";

const createReview = async (tenantId: string, payload: ICreateReviewPayload,) => {

    const property = await prisma.property.findUnique({
        where: {
            id: payload.propertyId
        }
    });

    if (!property) { 
        throw new Error("Property not found")
    }

    let rentalRequest;

    if (payload.rentalRequestId) {
        rentalRequest = await prisma.rentalRequest.findFirst({
            where: {
                id: payload.rentalRequestId,
                tenantId,
                propertyId: payload.propertyId,
                status: RentalStatus.COMPLETED
            }
        })
    } else { 
        rentalRequest = await prisma.rentalRequest.findFirst({
            where: {
                tenantId, 
                propertyId: payload.propertyId,
                status: RentalStatus.COMPLETED
            }
        })
    }
                
    if (!rentalRequest) { 
        throw new Error("You can only review after you have complete a rental for this property")
    }


    const checkPreviousReview = await prisma.review.findFirst({
        where: {
            tenantId,
            propertyId: payload.propertyId,
            rentalRequestId: rentalRequest.id
        }
    })

    if(checkPreviousReview) {
        throw new Error("You have already reviewed this property for this rental request")
    }

    const normalizedRating = Number(payload.rating);

    if (!Number.isFinite(normalizedRating) || normalizedRating < 1 || normalizedRating > 5) {
        throw new Error("Rating must be a number between 1 and 5");
    }

    const review = await prisma.review.create({
        data: {
            tenantId,
            propertyId: payload.propertyId,
            rentalRequestId: rentalRequest.id,
            rating: normalizedRating,
            comment: payload.comment
        },
        include: {
            tenant: {
                select: {
                    id: true,
                    name: true,
                    avatar: true
                }
            },
            property: {
                select: {
                    id: true,
                    title: true,
                    address: true,
                    city: true,
                }
            }  
        }
    })

    return review 

};

export const reviewService = {
  createReview,
};
