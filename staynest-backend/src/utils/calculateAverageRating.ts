import { getReviewsByHotelId } from "../modules/review/review.service";

export const calculateAverageRating = async (hotelId: string) => {
  const data = await getReviewsByHotelId(hotelId);

  if (data.length === 0) {
    return {
      avgRating: 0,
      totalReviews: 0,
    };
  }
  const totalReviews = data.length;
  const sumOfRatings = data.reduce((acc, d) => acc + d.rating, 0);
  const avgRating = Number(sumOfRatings / totalReviews).toFixed(1);

  return {
    avgRating,
    totalReviews,
  };
};
