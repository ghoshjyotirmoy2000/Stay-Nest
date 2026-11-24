import { prisma } from "../../db";

type UpdateUserInput = {
  firstname?: string;
  lastname?: string;
  phone?: string;
};

export const getUserById = async (id: string) => {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      firstname: true,
      lastname: true,
      phone: true,
      role: true,
      createdAt: true,
    },
  });
};

export const getAllUsers = async () => {
  return prisma.user.findMany({
    select: {
      id: true,
      email: true,
      firstname: true,
      lastname: true,
      phone: true,
      role: true,
      createdAt: true,
    },
  });
};

export const getAllHotelAdmins = async () => {
  return prisma.user.findMany({
    where: { role: "OWNER" },
    select: {
      id: true,
      email: true,
      firstname: true,
      lastname: true,
      phone: true,
      role: true,
      createdAt: true,
      _count: {
        select: { hotels: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

export const updateUser = async (id: string, data: UpdateUserInput) => {
  return prisma.user.update({
    where: { id },
    data,
    select: {
      id: true,
      email: true,
      firstname: true,
      lastname: true,
      phone: true,
      role: true,
      createdAt: true,
    },
  });
};

export const deleteUser = async (id: string) => {
  return prisma.user.delete({
    where: { id },
  });
};