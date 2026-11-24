import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  CalendarDays,
  Users,
  MapPin,
  Star,
  ArrowLeft,
  Info,
} from "lucide-react";
import Navbar from "../../components/common/Navbar";
import { createBooking } from "../../store/slices/bookingSlice";
import { getRoomsByHotel } from "../../store/slices/roomSlice";
import { getHotelById } from "../../store/slices/hotelSlice";
import type { AppDispatch, RootState } from "../../store";
import api from "../../api/axiosInstance";

const schema = z
  .object({
    checkInDate: z.string().min(1, "Check-in date is required"),
    checkOutDate: z.string().min(1, "Check-out date is required"),
    guests: z.string().min(1, "At least 1 guest required"),
  })
  .refine((data) => new Date(data.checkOutDate) > new Date(data.checkInDate), {
    message: "Check-out must be after check-in",
    path: ["checkOutDate"],
  });

type FormData = z.infer<typeof schema>;

type PricingBreakdown = {
  basePrice: number;
  weekendMultiplier: number;
  seasonMultiplier: number;
  lastMinuteDiscount: number;
  occupancyMultiplier: number;
  finalPricePerNight: number;
  nights: number;
  totalPrice: number;
};

const MultiplierBadge = ({
  label,
  value,
}: {
  label: string;
  value: number;
}) => {
  const isDiscount = value < 1;
  const isNeutral = value === 1;
  return (
    <div
      className={`flex items-center justify-between py-2.5 border-b border-neutral-100 last:border-0`}
    >
      <span className="text-sm text-neutral-500">{label}</span>
      <span
        className={`text-sm font-semibold ${isNeutral ? "text-neutral-400" : isDiscount ? "text-green-500" : "text-orange-500"}`}
      >
        {isNeutral
          ? "—"
          : isDiscount
            ? `-${((1 - value) * 100).toFixed(0)}%`
            : `+${((value - 1) * 100).toFixed(0)}%`}
      </span>
    </div>
  );
};

const Booking = () => {
  const { roomId } = useParams();
  const [searchParams] = useSearchParams();
  const hotelId = searchParams.get("hotelId");
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isLoading } = useSelector((state: RootState) => state.booking);
  const { rooms } = useSelector((state: RootState) => state.room);
  const { selectedHotel } = useSelector((state: RootState) => state.hotel);
  const [pricing, setPricing] = useState<PricingBreakdown | null>(null);
  const [isPricingLoading, setIsPricingLoading] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(false);

  const room = rooms.find((r) => r.id === roomId);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const checkInDate = watch("checkInDate");
  const checkOutDate = watch("checkOutDate");

  useEffect(() => {
    if (hotelId) {
      dispatch(getHotelById(hotelId));
      dispatch(getRoomsByHotel(hotelId));
    }
  }, [hotelId, dispatch]);

  // fetch price preview when dates change
  useEffect(() => {
    const fetchPricing = async () => {
      if (!checkInDate || !checkOutDate || !roomId || !hotelId) return;
      if (new Date(checkOutDate) <= new Date(checkInDate)) return;

      setIsPricingLoading(true);
      try {
        const res = await api.post("/booking/price-preview", {
          roomId,
          hotelId,
          checkInDate,
          checkOutDate,
        });
        setPricing(res.data.data);
      } catch (err) {
        console.error("Price preview failed", err);
      } finally {
        setIsPricingLoading(false);
      }
    };

    fetchPricing();
  }, [checkInDate, checkOutDate, roomId, hotelId]);

  const onSubmit = async (data: FormData) => {
    const result = await dispatch(
      createBooking({
        roomId: roomId!,
        hotelId: hotelId!,
        checkInDate: data.checkInDate,
        checkOutDate: data.checkOutDate,
        guests: Number(data.guests), // ✅ convert here
      }),
    );

    if (createBooking.fulfilled.match(result)) {
      navigate("/dashboard/bookings");
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-page font-sans">
      <Navbar />

      <div className="pt-24 pb-16 px-[5%] max-w-[1000px] mx-auto">
        {/* BACK */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-neutral-400 hover:text-brand-dark transition-colors bg-transparent border-none cursor-pointer mb-8 text-sm font-medium"
        >
          <ArrowLeft size={16} /> Back to hotel
        </button>

        <div className="grid grid-cols-[1fr_380px] gap-8">
          {/* LEFT — FORM */}
          <div>
            <h1 className="text-2xl font-extrabold text-brand-dark tracking-tight mb-2">
              Complete Your Booking
            </h1>
            <p className="text-neutral-400 text-sm mb-8">
              Fill in your stay details below
            </p>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-6"
            >
              {/* DATES */}
              <div className="bg-white rounded-2xl border border-neutral-100 p-6">
                <h2 className="text-base font-bold text-brand-dark mb-5 flex items-center gap-2">
                  <CalendarDays size={18} className="text-brand" /> Stay Dates
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[13px] font-semibold text-brand-dark mb-2">
                      Check-in Date
                    </label>
                    <input
                      {...register("checkInDate")}
                      type="date"
                      min={today}
                      className={`w-full px-4 py-3 rounded-xl border-[1.5px] bg-white text-sm outline-none text-brand-dark transition-colors ${errors.checkInDate ? "border-red-300" : "border-neutral-200 focus:border-brand"}`}
                    />
                    {errors.checkInDate && (
                      <p className="text-red-500 text-xs mt-1.5">
                        {errors.checkInDate.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold text-brand-dark mb-2">
                      Check-out Date
                    </label>
                    <input
                      {...register("checkOutDate")}
                      type="date"
                      min={checkInDate || today}
                      className={`w-full px-4 py-3 rounded-xl border-[1.5px] bg-white text-sm outline-none text-brand-dark transition-colors ${errors.checkOutDate ? "border-red-300" : "border-neutral-200 focus:border-brand"}`}
                    />
                    {errors.checkOutDate && (
                      <p className="text-red-500 text-xs mt-1.5">
                        {errors.checkOutDate.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* GUESTS */}
              <div className="bg-white rounded-2xl border border-neutral-100 p-6">
                <h2 className="text-base font-bold text-brand-dark mb-5 flex items-center gap-2">
                  <Users size={18} className="text-brand" /> Guests
                </h2>
                <div>
                  <label className="block text-[13px] font-semibold text-brand-dark mb-2">
                    Number of Guests{" "}
                    {room && (
                      <span className="text-neutral-400 font-normal">
                        (max {room.maxOccupancy})
                      </span>
                    )}
                  </label>
                  <input
                    {...register("guests")}
                    type="number"
                    min="1"
                    max={room?.maxOccupancy || 10}
                    placeholder="2"
                    className={`w-full px-4 py-3 rounded-xl border-[1.5px] bg-white text-sm outline-none text-brand-dark transition-colors ${errors.guests ? "border-red-300" : "border-neutral-200 focus:border-brand"}`}
                  />
                  {errors.guests && (
                    <p className="text-red-500 text-xs mt-1.5">
                      {errors.guests.message}
                    </p>
                  )}
                </div>
              </div>

              {/* PRICE BREAKDOWN */}
              {pricing && (
                <div className="bg-white rounded-2xl border border-neutral-100 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base font-bold text-brand-dark flex items-center gap-2">
                      <Info size={18} className="text-brand" /> Price Breakdown
                    </h2>
                    <button
                      type="button"
                      onClick={() => setShowBreakdown(!showBreakdown)}
                      className="text-xs text-brand font-semibold bg-transparent border-none cursor-pointer"
                    >
                      {showBreakdown ? "Hide" : "Show"} details
                    </button>
                  </div>

                  {showBreakdown && (
                    <div className="mb-4">
                      <MultiplierBadge
                        label="Weekend surcharge"
                        value={pricing.weekendMultiplier}
                      />
                      <MultiplierBadge
                        label="Season pricing"
                        value={pricing.seasonMultiplier}
                      />
                      <MultiplierBadge
                        label="Last minute discount"
                        value={pricing.lastMinuteDiscount}
                      />
                      <MultiplierBadge
                        label="Occupancy surcharge"
                        value={pricing.occupancyMultiplier}
                      />
                    </div>
                  )}

                  <div className="flex flex-col gap-2 text-sm">
                    <div className="flex justify-between text-neutral-500">
                      <span>Base price</span>
                      <span>₹{pricing.basePrice.toLocaleString()}/night</span>
                    </div>
                    <div className="flex justify-between text-neutral-500">
                      <span>Final price/night</span>
                      <span className="font-semibold text-brand-dark">
                        ₹{pricing.finalPricePerNight.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-neutral-500">
                      <span>Nights</span>
                      <span>{pricing.nights}</span>
                    </div>
                    <div className="flex justify-between text-base font-extrabold text-brand-dark border-t border-neutral-100 pt-3 mt-1">
                      <span>Total</span>
                      <span className="text-brand">
                        ₹{pricing.totalPrice.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {isPricingLoading && (
                <div className="bg-white rounded-2xl border border-neutral-100 p-6 flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-brand border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm text-neutral-400">
                    Calculating price...
                  </span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || !pricing}
                className={`w-full py-4 rounded-xl text-white text-base font-bold border-none cursor-pointer transition-colors ${isLoading || !pricing ? "bg-neutral-300 cursor-not-allowed" : "bg-brand-dark hover:bg-brand"}`}
              >
                {isLoading
                  ? "Confirming..."
                  : `Confirm Booking ${pricing ? `— ₹${pricing.totalPrice.toLocaleString()}` : ""}`}
              </button>
            </form>
          </div>

          {/* RIGHT — ROOM SUMMARY */}
          <div>
            <div className="sticky top-[90px]">
              {/* ROOM CARD */}
              <div className="bg-white rounded-2xl border border-neutral-100 overflow-hidden mb-4">
                {room?.images?.[0] && (
                  <img
                    src={room.images[0]}
                    alt={room.roomType}
                    className="w-full h-[180px] object-cover"
                  />
                )}
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-bold text-brand-dark text-base">
                      Room {room?.roomNumber}
                    </h3>
                    <span className="text-xs bg-brand/10 text-brand px-2 py-0.5 rounded-full font-semibold">
                      {room?.roomType}
                    </span>
                  </div>
                  <p className="text-neutral-400 text-sm flex items-center gap-1 mb-3">
                    <Users size={13} /> Up to {room?.maxOccupancy} guests
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-extrabold text-brand">
                      ₹{Number(room?.pricePerNight || 0).toLocaleString()}
                    </span>
                    <span className="text-neutral-400 text-sm">
                      /night (base)
                    </span>
                  </div>
                </div>
              </div>

              {/* HOTEL CARD */}
              {selectedHotel && (
                <div className="bg-white rounded-2xl border border-neutral-100 p-5">
                  <p className="text-xs text-neutral-400 font-semibold uppercase tracking-wider mb-3">
                    Property
                  </p>
                  <h4 className="font-bold text-brand-dark text-sm mb-1">
                    {selectedHotel.name}
                  </h4>
                  <p className="text-neutral-400 text-xs flex items-center gap-1 mb-3">
                    <MapPin size={11} /> {selectedHotel.city},{" "}
                    {selectedHotel.country}
                  </p>
                  <div className="flex items-center gap-1.5">
                    <Star size={13} className="fill-amber-400 text-amber-400" />
                    <span className="text-sm font-bold text-brand-dark">
                      {Number(selectedHotel.rating).toFixed(1)}
                    </span>
                    <span className="text-xs text-neutral-400">
                      ({selectedHotel.totalReviews} reviews)
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
