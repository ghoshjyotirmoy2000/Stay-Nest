import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Plus, MapPin, Star, BedDouble, Pencil, Trash2, DoorOpen } from "lucide-react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { getOwnerHotels, deleteHotel } from "../../store/slices/hotelSlice";
import type { AppDispatch, RootState } from "../../store";

const MyHotels = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { ownerHotels, isLoading } = useSelector((state: RootState) => state.hotel);

  useEffect(() => {
    dispatch(getOwnerHotels());
  }, [dispatch]);

  const handleDelete = async (hotelId: string) => {
    if (confirm("Are you sure you want to delete this hotel?")) {
      dispatch(deleteHotel(hotelId));
    }
  };

  return (
    <DashboardLayout>
      <div className="p-8">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-brand-dark tracking-tight m-0">My Hotels</h1>
            <p className="text-neutral-400 text-sm mt-1 m-0">Manage your listed properties</p>
          </div>
          <button onClick={() => navigate("/dashboard/hotels/create")}
            className="flex items-center gap-2 bg-brand text-white border-none px-5 py-2.5 rounded-xl text-sm font-bold cursor-pointer hover:bg-brand/90 transition-colors">
            <Plus size={16} /> Add Hotel
          </button>
        </div>

        {/* STATS ROW */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Total Hotels", value: ownerHotels.length },
            { label: "Avg Rating", value: ownerHotels.length > 0 ? (ownerHotels.reduce((acc, h) => acc + Number(h.rating), 0) / ownerHotels.length).toFixed(1) : "0.0" },
            { label: "Total Reviews", value: ownerHotels.reduce((acc, h) => acc + h.totalReviews, 0) },
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

        {/* EMPTY STATE */}
        {!isLoading && ownerHotels.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-brand/10 rounded-2xl flex items-center justify-center mb-4">
              <BedDouble size={32} className="text-brand" />
            </div>
            <h3 className="text-lg font-bold text-brand-dark mb-2">No hotels yet</h3>
            <p className="text-neutral-400 text-sm mb-6 max-w-75">Start by adding your first property to reach thousands of guests</p>
            <button onClick={() => navigate("/dashboard/hotels/create")}
              className="flex items-center gap-2 bg-brand text-white border-none px-5 py-2.5 rounded-xl text-sm font-bold cursor-pointer">
              <Plus size={16} /> Add Your First Hotel
            </button>
          </div>
        )}

        {/* HOTEL GRID */}
        {!isLoading && ownerHotels.length > 0 && (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(340px,1fr))] gap-6">
            {ownerHotels.map(hotel => (
              <div key={hotel.id} className="bg-white rounded-2xl border border-neutral-100 overflow-hidden hover:shadow-lg transition-shadow">

                {/* IMAGE */}
                <div className="relative h-45 bg-neutral-100">
                  {hotel.images?.[0] ? (
                    <img src={hotel.images[0]} alt={hotel.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BedDouble size={40} className="text-neutral-300" />
                    </div>
                  )}
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center gap-1">
                    <Star size={12} className="fill-amber-400 text-amber-400" />
                    <span className="text-xs font-bold text-brand-dark">{Number(hotel.rating).toFixed(1)}</span>
                  </div>
                </div>

                {/* CONTENT */}
                <div className="p-5">
                  <h3 className="font-bold text-brand-dark text-base mb-1 truncate">{hotel.name}</h3>
                  <p className="text-neutral-400 text-sm flex items-center gap-1 mb-4">
                    <MapPin size={13} /> {hotel.city}, {hotel.country}
                  </p>

                  {/* AMENITIES */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {(hotel.amenities as string[]).slice(0, 3).map(a => (
                      <span key={a} className="text-[11px] bg-neutral-100 text-neutral-500 px-2 py-1 rounded-md font-medium">{a}</span>
                    ))}
                    {(hotel.amenities as string[]).length > 3 && (
                      <span className="text-[11px] bg-neutral-100 text-neutral-500 px-2 py-1 rounded-md font-medium">+{(hotel.amenities as string[]).length - 3} more</span>
                    )}
                  </div>

                  {/* ACTIONS */}
                  <div className="flex gap-2 pt-4 border-t border-neutral-100">
                    <button onClick={() => navigate(`/dashboard/hotels/${hotel.id}/rooms`)}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-brand-dark text-white border-none py-2 rounded-xl text-xs font-bold cursor-pointer hover:bg-brand transition-colors">
                      <DoorOpen size={13} /> Manage Rooms
                    </button>
                    <button onClick={() => navigate(`/dashboard/hotels/${hotel.id}/edit`)}
                      className="flex items-center justify-center gap-1.5 bg-neutral-100 text-brand-dark border-none px-3 py-2 rounded-xl text-xs font-bold cursor-pointer hover:bg-neutral-200 transition-colors">
                      <Pencil size={13} />
                    </button>
                    <button onClick={() => handleDelete(hotel.id)}
                      className="flex items-center justify-center gap-1.5 bg-red-50 text-red-500 border-none px-3 py-2 rounded-xl text-xs font-bold cursor-pointer hover:bg-red-100 transition-colors">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MyHotels;