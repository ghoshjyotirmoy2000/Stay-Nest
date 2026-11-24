import { prisma } from "../../db";

type CreateUserInput = {
  email: string;
  firstname: string;
  lastname: string;
  password: string;
  role: "CUSTOMER" | "OWNER";
  phone: string;
};

export const createUser = async (data: CreateUserInput) => {
  const user = await prisma.user.create({data});

  return user;
};

export const getUser = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  return user;
};

export const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
  });

  return user;
};

export const signInUser = async (id: string, refreshToken: string) => {
  return prisma.user.update({
    where: { id },
    data: { refreshToken },
  });
};

export const logoutUser = async(id : string) => {
  return prisma.user.update({
    where : {id},
    data : {refreshToken : null}
  })
}
