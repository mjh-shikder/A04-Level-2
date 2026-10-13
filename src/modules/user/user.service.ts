import { prisma } from "../../lib/prisma";


const updateUser = async (userId: string, payload: {name?: string; phone?: string; avatar?: string}) => { 


    const user = await prisma.user.findUnique({
    where: { id: userId },
    });
     

    const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: payload,
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

  return updatedUser;

}

export const userService = {
    updateUser
}