import { prisma } from "../../db";

type createHotelInput = {
  ownerId: string;
  name: string;
  description?: string;
  city: string;
  country: string;
  amenities: string[];
  images?: string[];
};

type GetHotelInput = {
  city?: string;
  country?: string;
  amenities?: string[];
  cursor?: string;
  limit?: number;
};

export const createHotel = async (data: createHotelInput) => {
  return prisma.hotel.create({ data });
};

export const getAllHotel = async (data: GetHotelInput) => {
  const { city, country, amenities , cursor , limit = 5 } = data;

  const filters: any = {};

  if (city) {
    filters.city = city;
  }

  if (country) {
    filters.country = country;
  }

  if (amenities && amenities.length > 0) {
    filters.amenities = {
      hasEvery: amenities,
    };
  }

  const hotels =  await prisma.hotel.findMany({
    where: filters,
    take: limit + 1, // get extra item
    cursor: cursor ? {id : cursor} : undefined,
    skip : cursor ? 1 : 0,
    orderBy: [
    { createdAt: "desc" }, // stable chronological sort
    { id: "desc" },        // tiebreaker for same-second inserts
  ],
  });

  const hasNextPage = hotels.length > limit;

  const hotelData = hasNextPage ? hotels.slice(0 , limit) : hotels

  const lastItem = hotelData[hotelData.length - 1];

  const nextCursor = hasNextPage ? lastItem?.id : null

  return {
    hotelData,
    nextCursor,
    hasNextPage,
  }
};

export const getHotelById = async (id: string) => {
  return prisma.hotel.findUnique({
    where: { id },
    include: {
      owner: true,
    },
  });
};

export const getHotelByOwnerId = async (ownerId: string) => {
  return prisma.hotel.findMany({
    where: { ownerId },
  });
};

export const updateHotel = async (
  id: string,
  data: Partial<createHotelInput>,
) => {
  return prisma.hotel.update({
    where: { id },
    data,
  });
};

export const deleteHotel = async (id: string) => {
  return prisma.hotel.delete({
    where: { id },
  });
};
