import { prisma } from "../db";

type DynamicPricingInput = {
  basePrice: number;
  checkInDate: Date;
  checkOutDate: Date;
  hotelId: string;
};

type PricingBreakdown = {
  basePrice: number;
  weekendMultiplier: number;
  seasonMultiplier: number;
  lastMinuteDiscount: number;
  occupancyMultiplier: number;
  finalPricePerNight: number;
};

// ==================== HELPERS ====================

const isWeekend = (date: Date): boolean => {
  const day = date.getDay();
  return day === 0 || day === 6; // 0 = Sunday, 6 = Saturday
};

const getSeasonMultiplier = (date: Date): number => {
  const month = date.getMonth() + 1; // 1-12

  if (month >= 10 || month <= 2) return 1.4; // Peak   (Oct - Feb)
  if (month >= 3 && month <= 5) return 1.2;  // Shoulder (Mar - May)
  return 0.9;                                 // Off season (Jun - Sep)
};

const isLastMinute = (checkInDate: Date): boolean => {
  const today = new Date();
  const diff = checkInDate.getTime() - today.getTime();
  const days = diff / (1000 * 60 * 60 * 24);
  return days <= 2;
};

const getOccupancyMultiplier = async (
  hotelId: string,
  checkInDate: Date,
  checkOutDate: Date
): Promise<number> => {
  // get total rooms in hotel
  const totalRooms = await prisma.room.count({
    where: { hotelId },
  });

  if (totalRooms === 0) return 1;

  // get booked rooms for those dates
  const bookedRooms = await prisma.booking.count({
    where: {
      hotelId,
      status: "CONFIRMED",
      AND: [
        { checkInDate: { lt: checkOutDate } },
        { checkOutDate: { gt: checkInDate } },
      ],
    },
  });

  const occupancyRate = bookedRooms / totalRooms;

  if (occupancyRate >= 0.8) return 1.25; // High occupancy surge
  return 1;
};

// ==================== MAIN ENGINE ====================

export const calculateDynamicPrice = async (
  input: DynamicPricingInput
): Promise<PricingBreakdown> => {
  const { basePrice, checkInDate, checkOutDate, hotelId } = input;

  // 1. weekend check
  const weekendMultiplier = isWeekend(checkInDate) ? 1.2 : 1;

  // 2. season check
  const seasonMultiplier = getSeasonMultiplier(checkInDate);

  // 3. last minute check
  const lastMinuteDiscount = isLastMinute(checkInDate) ? 0.85 : 1;

  // 4. occupancy check
  const occupancyMultiplier = await getOccupancyMultiplier(
    hotelId,
    checkInDate,
    checkOutDate
  );

  // 5. calculate final price
  const finalPricePerNight = Number(
    (
      basePrice *
      weekendMultiplier *
      seasonMultiplier *
      lastMinuteDiscount *
      occupancyMultiplier
    ).toFixed(2)
  );

  return {
    basePrice,
    weekendMultiplier,
    seasonMultiplier,
    lastMinuteDiscount,
    occupancyMultiplier,
    finalPricePerNight,
  };
};