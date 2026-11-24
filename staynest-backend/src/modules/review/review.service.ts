import { prisma } from "../../db";

type CreateReviewInput = {
  userId: string;
  hotelId: string;
  bookingId: string;
  rating: number;
  comment?: string;
};


export const createReview = async (data: CreateReviewInput) => {
  return prisma.$transaction(async (tx) => {
    // 1. save review first
    const review = await tx.review.create({ data });

    // 2. fetch ALL reviews including the new one
    const allReviews = await tx.review.findMany({
      where: { hotelId: data.hotelId },
    });

    // 3. calculate average with new review included
    const totalReviews = allReviews.length;
    const sumOfRatings = allReviews.reduce((acc, r) => acc + r.rating, 0);
    const avgRating = Number(sumOfRatings / totalReviews).toFixed(1);

    // 4. update hotel
    await tx.hotel.update({
      where: { id: data.hotelId },
      data: {
        totalReviews,
        rating: avgRating,
      },
    });

    return review;
  });
};

export const getAllReviews = async () => {
  return prisma.review.findMany();
};

export const getReviewsByHotelId = async (hotelId: string) => {
  return prisma.review.findMany({
    where: { hotelId }
  });
};

export const getReviewsByUserId = async (userId: string) => {
  return prisma.review.findMany({
    where: { userId },
  });
};

export const deleteReview = async (id: string) => {
  return prisma.review.delete({
    where: { id },
  });
};
