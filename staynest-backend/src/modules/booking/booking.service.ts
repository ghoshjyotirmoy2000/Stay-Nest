import { prisma } from "../../db";

type CreateBookingInput = {
  userId: string;
  roomId: string;
  hotelId: string;
  checkInDate: Date;
  checkOutDate: Date;
  guests: number;
  totalPrice: number;
};

export const createBooking = async (data: CreateBookingInput) => {
  return prisma.booking.create({ data });
};

// cleaner
export const checkBookingConflict = async (
  roomId: string,
  checkInDate: Date,
  checkOutDate: Date
) => {
  const conflict = await prisma.booking.findFirst({
    where: {
      roomId,
      status: "CONFIRMED",
      AND: [
        { checkInDate: { lt: checkOutDate } },
        { checkOutDate: { gt: checkInDate } },
      ],
    },
  });

  return conflict;
};

export const getAllBookings = async () => {
  return prisma.booking.findMany();
};

export const getBookingById = async (id: string) => {
  return prisma.booking.findUnique({
    where: { id },
  });
};

export const getBookingsByUserId = async (userId: string) => {
  return prisma.booking.findMany({
    where: { userId },
  });
};

export const getBookingsByHotelId = async (hotelId: string) => {
  return prisma.booking.findMany({
    where: { hotelId },
  });
};

export const cancelBooking = async (id: string) => {
  return prisma.booking.update({
    where: { id },
    data: {
      status: "CANCELLED",
      cancelledAt: new Date(),
    },
  });
};