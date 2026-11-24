import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Mail, Phone, Hotel, ShieldCheck, ChevronDown, MapPin, Star } from "lucide-react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { getHotelAdmins, getHotelsByOwner } from "../../store/slices/adminSlice";
import type { AppDispatch, RootState } from "../../store";

const HotelAdmins = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { hotelAdmins, ownerHotelsById, isLoading, error } = useSelector((state: RootState) => state.admin);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(getHotelAdmins());
  }, [dispatch]);

  const toggleExpand = (ownerId: string) => {
    if (expandedId === ownerId) {
      setExpandedId(null);
      return;
    }
    setExpandedId(ownerId);
    if (!ownerHotelsById[ownerId]) {
      dispatch(getHotelsByOwner(ownerId));
    }
  };

  return (
    <DashboardLayout>
      <div className="p-8">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-brand-dark tracking-tight m-0">Hotel Admins</h1>
            <p className="text-neutral-400 text-sm mt-1 m-0">All property owners registered on StayNest</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-6">
            <p className="text-red-600 text-sm m-0">{error}</p>
          </div>
        )}

        {/* STATS */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 border border-neutral-100">
            <p className="text-neutral-400 text-xs font-semibold uppercase tracking-wider m-0 mb-2">Total Hotel Admins</p>
            <p className="text-3xl font-extrabold text-brand-dark m-0">{hotelAdmins.length}</p>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-neutral-100">
            <p className="text-neutral-400 text-xs font-semibold uppercase tracking-wider m-0 mb-2">Total Hotels Listed</p>
            <p className="text-3xl font-extrabold text-brand-dark m-0">
              {hotelAdmins.reduce((acc, a) => acc + a._count.hotels, 0)}
            </p>
          </div>
        </div>

        {/* LOADING */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* EMPTY */}
        {!isLoading && hotelAdmins.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-brand/10 rounded-2xl flex items-center justify-center mb-4">
              <ShieldCheck size={32} className="text-brand" />
            </div>
            <h3 className="text-lg font-bold text-brand-dark mb-2">No hotel admins yet</h3>
            <p className="text-neutral-400 text-sm">Owners will show up here once they register</p>
          </div>
        )}

        {/* TABLE */}
        {!isLoading && hotelAdmins.length > 0 && (
          <div className="bg-white rounded-2xl border border-neutral-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-neutral-100">
              <h2 className="text-sm font-bold text-brand-dark m-0">{hotelAdmins.length} Owners</h2>
            </div>

            <div className="divide-y divide-neutral-100">
              {hotelAdmins.map(admin => {
                const isExpanded = expandedId === admin.id;
                const ownerHotels = ownerHotelsById[admin.id];

                return (
                  <div key={admin.id}>
                    <button
                      onClick={() => toggleExpand(admin.id)}
                      className="w-full flex items-center gap-4 px-6 py-4 hover:bg-neutral-50 transition-colors bg-transparent border-none cursor-pointer text-left"
                    >
                      <div className="w-11 h-11 rounded-full bg-brand/10 flex items-center justify-center shrink-0">
                        <span className="text-brand text-sm font-bold">
                          {admin.firstname?.[0]}{admin.lastname?.[0]}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-brand-dark text-sm m-0 mb-1">
                          {admin.firstname} {admin.lastname}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-neutral-400">
                          <span className="flex items-center gap-1"><Mail size={11} /> {admin.email}</span>
                          <span className="flex items-center gap-1"><Phone size={11} /> {admin.phone}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 bg-brand/10 text-brand px-3 py-1.5 rounded-full text-xs font-bold shrink-0">
                        <Hotel size={13} /> {admin._count.hotels} {admin._count.hotels === 1 ? "hotel" : "hotels"}
                      </div>

                      <ChevronDown size={16} className={`text-neutral-400 shrink-0 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                    </button>

                    {isExpanded && (
                      <div className="bg-neutral-50 px-6 py-4 pl-21">
                        {!ownerHotels && (
                          <div className="flex items-center gap-2 text-neutral-400 text-xs py-2">
                            <div className="w-3.5 h-3.5 border-2 border-brand border-t-transparent rounded-full animate-spin" />
                            Loading hotels...
                          </div>
                        )}
                        {ownerHotels && ownerHotels.length === 0 && (
                          <p className="text-neutral-400 text-xs m-0 py-2">This owner hasn't listed any hotels yet.</p>
                        )}
                        {ownerHotels && ownerHotels.length > 0 && (
                          <div className="flex flex-col gap-2">
                            {ownerHotels.map(hotel => (
                              <div key={hotel.id} className="flex items-center justify-between bg-white rounded-xl px-4 py-2.5 border border-neutral-100">
                                <div>
                                  <p className="font-semibold text-brand-dark text-sm m-0">{hotel.name}</p>
                                  <p className="text-neutral-400 text-xs flex items-center gap-1 m-0 mt-0.5">
                                    <MapPin size={11} /> {hotel.city}, {hotel.country}
                                  </p>
                                </div>
                                <div className="flex items-center gap-1 text-xs font-bold text-brand-dark">
                                  <Star size={12} className="fill-amber-400 text-amber-400" />
                                  {Number(hotel.rating).toFixed(1)}
                                  <span className="text-neutral-400 font-normal">({hotel.totalReviews})</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default HotelAdmins;
