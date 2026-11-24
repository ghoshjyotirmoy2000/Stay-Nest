import { prisma } from "../../db";

type CreateRoomInput = {
  hotelId: string;
  roomNumber: string;
  roomType: string;
  pricePerNight: number;
  maxOccupancy: number;
  images?: string[];
};

export const createRoom = async (data: CreateRoomInput) => {
  return prisma.room.create({ data });
};

export const getAllRooms = async () => {
  return prisma.room.findMany();
};

export const getRoomById = async (id: string) => {
  return prisma.room.findUnique({
    where: { id },
  });
};

export const getRoomsByHotelId = async (hotelId: string) => {
  return prisma.room.findMany({
    where: { hotelId },
  });
};

export const deleteRoom = async (id: string) => {
  return prisma.room.delete({
    where: { id },
  });
};