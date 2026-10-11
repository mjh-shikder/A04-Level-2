import { prisma } from "../../lib/prisma";


const getAllCategory = async () => { 

    const categories = await prisma.category.findMany({
        include: {
            _count: {
                select: {properties: true}
            }
        }
    })

    return categories

}



export const categoryService = {
    getAllCategory,

}