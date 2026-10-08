import { Prisma, PropertyStatus, UserRole, UserStatus } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { ICreateProperty, IGetAllPropertiesQuery, IUpdateProperty } from "../../types/type";

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


// * Delete Property
const deleteProperty = async (id: string, userId: string, userRole: UserRole) => {

    const property = await prisma.property.findUnique({
        where: { id },
        include: {
            rentalRequests: {
                where: {
                    status: { in: ['ACTIVE', 'PENDING', 'PAID', 'APPROVED'] }
                }
            }
        }
    })

    if (!property) {
        throw new Error('Property Not Found');
    }

    if (userRole === UserRole.TENANT) {
        throw new Error("You are not authorized to delete this property")
    }

    if (property.rentalRequests.length > 0) {
        throw new Error('Cannot delete this property with active or pending rental requests!')
    }

    await prisma.property.delete({
        where: { id }
    })

    return { message: "Property Deleted Successfully" }

};


// * Get Land Lord Properties with rental reques and review
const getLandlordProperties = async (landlordId: string) => { 

    const properties = await prisma.property.findMany({
        where: { landlordId },
        include: {
            category: true,
            _count: {
                select: {
                    rentalRequests: true,
                    reviews: true,
                }
            }
        },
        orderBy: { createdAt: 'desc'}
    })

    return properties
}


// * Get All Properties
const getAllProperties = async (query: IGetAllPropertiesQuery) => {

    const page = parseInt(query.page || '1', 10);
    const limit = parseInt(query.limit || '10', 10)
    const skip = (page - 1) * limit;

    const whereConditions: Prisma.PropertyWhereInput = {};

    if (query.sortOrder) {
        whereConditions.status = query.status;

    } else { 
        whereConditions.status = PropertyStatus.AVAILABLE;
    }

    if (query.city) { 
        whereConditions.city = { equals: query.city, mode: 'insensitive' }
    }

    
  if (query.country) {
    whereConditions.country = { equals: query.country, mode: "insensitive" };
  }

  if (query.categoryId) {
    whereConditions.categoryId = query.categoryId;
  }

  if (query.bedrooms) {
    whereConditions.bedrooms = parseInt(query.bedrooms, 10);
  }

  if (query.bathrooms) {
    whereConditions.bathrooms = parseInt(query.bathrooms, 10);
  }

  if (query.furnished !== undefined) {
    whereConditions.furnished = query.furnished === "true";
  }

  if (query.minRent || query.maxRent) {
    whereConditions.rent = {};
    if (query.minRent) {
      whereConditions.rent.gte = parseFloat(query.minRent);
    }
    if (query.maxRent) {
      whereConditions.rent.lte = parseFloat(query.maxRent);
    }
  }

  if (query.search) {
    whereConditions.OR = [
      { title: { contains: query.search, mode: "insensitive" } },
      { description: { contains: query.search, mode: "insensitive" } },
      { address: { contains: query.search, mode: "insensitive" } },
      { city: { contains: query.search, mode: "insensitive" } },
    ];
    }

    const sortBy = query.sortBy || "createdAt";
    const sortOrder = query.sortOrder || "desc";

    const [properties, total] = await Promise.all([
      prisma.property.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
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
          reviews: {
            select: {
              rating: true,
            },
          },
        },
      }),
      prisma.property.count({ where: whereConditions }),
    ]);


     const formattedProperties = properties.map((property) => {
       const totalRatings = property.reviews.length;
       const avgRating =
         totalRatings > 0
           ? property.reviews.reduce((acc, curr) => acc + curr.rating, 0) /
             totalRatings
           : 0;

       const { reviews, ...rest } = property;
       return {
         ...rest,
         totalReviews: totalRatings,
         averageRating: parseFloat(avgRating.toFixed(1)),
       };
     });

     return {
       meta: {
         page,
         limit,
         total,
         totalPage: Math.ceil(total / limit),
       },
       data: formattedProperties,
     };
    
}


export const propertyService = {
    createProperty,
    updateProperty,
    deleteProperty,
    getLandlordProperties,
    getAllProperties,

    
}