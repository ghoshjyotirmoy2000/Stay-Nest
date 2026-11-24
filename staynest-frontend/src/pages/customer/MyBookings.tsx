import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { CalendarDays, MapPin, BedDouble, X, Clock, CheckCircle } from "lucide-react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { getMyBookings, cancelBooking } from "../../store/slices/bookingSlice";
import type { AppDispatch, RootState } from "../../store";
import { format } from "date-fns";

const StatusBadge = ({ status }: { status: "CONFIRMED" | "CANCELLED" }) => {
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full ${status === "CONFIRMED" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"}`}>
      {status === "CONFIRMED" ? <CheckCircle size={11} /> : <X size={11} />}
      {status}
    </span>
  );
};

const MyBookings = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { bookings, isLoading } = useSelector((state: RootState) => state.booking);

  useEffect(() => {
    dispatch(getMyBookings());
  }, [dispatch]);

  const handleCancel = async (bookingId: string) => {
    if (confirm("Are you sure you want to cancel this booking?")) {
      dispatch(cancelBooking(bookingId));
    }
  };

  const confirmedCount = bookings.filter(b => b.status === "CONFIRMED").length;
  const cancelledCount = bookings.filter(b => b.status === "CANCELLED").length;
  const totalSpent = bookings
    .filter(b => b.status === "CONFIRMED")
    .reduce((acc, b) => acc + Number(b.totalPrice), 0);

  return (
    <DashboardLayout>
      <div className="p-8">

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-brand-dark tracking-tight m-0">My Bookings</h1>
          <p className="text-neutral-400 text-sm mt-1 m-0">Track and manage your hotel stays</p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Total Bookings", value: bookings.length },
            { label: "Confirmed", value: confirmedCount },
            { label: "Total Spent", value: `₹${totalSpent.toLocaleString()}` },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-2xl p-5 border border-neutral-100">
              <p className="text-neutral-400 text-xs font-semibold uppercase tracking-wider m-0 mb-2">{stat.label}</p>
              <p className="text-3xl font-extrabold text-brand-dark m-0">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* LOADING */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* EMPTY */}
        {!isLoading && bookings.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-brand/10 rounded-2xl flex items-center justify-center mb-4">
              <CalendarDays size={32} className="text-brand" />
            </div>
            <h3 className="text-lg font-bold text-brand-dark mb-2">No bookings yet</h3>
            <p className="text-neutral-400 text-sm mb-6">Start exploring hotels and make your first booking</p>
            <button onClick={() => navigate("/hotels")}
              className="bg-brand text-white border-none px-5 py-2.5 rounded-xl text-sm font-bold cursor-pointer hover:bg-brand/90 transition-colors">
              Explore Hotels
            </button>
          </div>
        )}

        {/* BOOKINGS LIST */}
        {!isLoading && bookings.length > 0 && (
          <div className="flex flex-col gap-4">
            {bookings.map(booking => {
              const nights = Math.ceil(
                (new Date(booking.checkOutDate).getTime() - new Date(booking.checkInDate).getTime()) / (1000 * 60 * 60 * 24)
              );

              return (
                <div key={booking.id} className="bg-white rounded-2xl border border-neutral-100 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-brand/10 rounded-xl flex items-center justify-center shrink-0">
                        <BedDouble size={18} className="text-brand" />
                      </div>
                      <div>
                        <p className="font-bold text-brand-dark text-sm m-0">Booking #{booking.id.slice(0, 8).toUpperCase()}</p>
                        <p className="text-neutral-400 text-xs m-0 flex items-center gap-1 mt-0.5">
                          <Clock size={11} /> Booked on {format(new Date(booking.bookingDate), "dd MMM yyyy")}
                        </p>
                      </div>
                    </div>
                    <StatusBadge status={booking.status} />
                  </div>

                  <div className="grid grid-cols-4 gap-4 py-4 border-y border-neutral-100 mb-4">
                    <div>
                      <p className="text-xs text-neutral-400 font-semibold uppercase tracking-wider mb-1">Check-in</p>
                      <p className="text-sm font-bold text-brand-dark flex items-center gap-1">
                        <CalendarDays size={13} className="text-brand" />
                        {format(new Date(booking.checkInDate), "dd MMM yyyy")}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-400 font-semibold uppercase tracking-wider mb-1">Check-out</p>
                      <p className="text-sm font-bold text-brand-dark flex items-center gap-1">
                        <CalendarDays size={13} className="text-brand" />
                        {format(new Date(booking.checkOutDate), "dd MMM yyyy")}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-400 font-semibold uppercase tracking-wider mb-1">Duration</p>
                      <p className="text-sm font-bold text-brand-dark">{nights} night{nights > 1 ? "s" : ""}</p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-400 font-semibold uppercase tracking-wider mb-1">Guests</p>
                      <p className="text-sm font-bold text-brand-dark">{booking.guests} guest{booking.guests > 1 ? "s" : ""}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-neutral-400 mb-1">Total Amount</p>
                      <p className="text-xl font-extrabold text-brand">₹{Number(booking.totalPrice).toLocaleString()}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => navigate(`/hotels/${booking.hotelId}`)}
                        className="flex items-center gap-1.5 bg-neutral-100 text-brand-dark border-none px-4 py-2 rounded-xl text-xs font-bold cursor-pointer hover:bg-neutral-200 transition-colors">
                        <MapPin size={13} /> View Hotel
                      </button>
                      {booking.status === "CONFIRMED" && (
                        <button onClick={() => handleCancel(booking.id)}
                          className="flex items-center gap-1.5 bg-red-50 text-red-500 border-none px-4 py-2 rounded-xl text-xs font-bold cursor-pointer hover:bg-red-100 transition-colors">
                          <X size={13} /> Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MyBookings;