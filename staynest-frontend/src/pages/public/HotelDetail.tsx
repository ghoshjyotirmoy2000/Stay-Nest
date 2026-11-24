import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { MapPin, Star, Users, ChevronLeft, ChevronRight, Wifi, Car, Waves, Dumbbell, Coffee, Shield, Utensils, Music, Thermometer, BriefcaseBusiness, Trees } from "lucide-react";
import Navbar from "../../components/common/Navbar";
import { getHotelById } from "../../store/slices/hotelSlice";
import { getRoomsByHotel } from "../../store/slices/roomSlice";
import type { AppDispatch, RootState } from "../../store";

const AMENITY_ICONS: Record<string, any> = {
  wifi: Wifi, pool: Waves, gym: Dumbbell, spa: Thermometer,
  parking: Car, restaurant: Utensils, bar: Coffee,
  security: Shield, livemusic: Music, workspace: BriefcaseBusiness,
  garden: Trees,
};

const HotelDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { selectedHotel, isLoading } = useSelector((state: RootState) => state.hotel);
  const { rooms } = useSelector((state: RootState) => state.room);
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    if (id) {
      dispatch(getHotelById(id));
      dispatch(getRoomsByHotel(id));
    }
  }, [id, dispatch]);

  const handleBookRoom = (roomId: string) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (user?.role === "OWNER") {
      alert("Owners cannot book rooms");
      return;
    }
    navigate(`/booking/${roomId}?hotelId=${id}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-page font-sans">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!selectedHotel) return null;

  const images = selectedHotel.images || [];

  return (
    <div className="min-h-screen bg-page font-sans">
      <Navbar />

      <div className="pt-17.5">

        {/* IMAGE GALLERY */}
        <div className="relative h-120 bg-neutral-100 overflow-hidden">
          {images.length > 0 ? (
            <>
              <img src={images[activeImage]} alt={selectedHotel.name}
                className="w-full h-full object-cover transition-all duration-500" />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />

              {/* image counter */}
              {images.length > 1 && (
                <>
                  <button onClick={() => setActiveImage(i => (i - 1 + images.length) % images.length)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-none cursor-pointer hover:bg-white/30 transition-colors">
                    <ChevronLeft size={20} className="text-white" />
                  </button>
                  <button onClick={() => setActiveImage(i => (i + 1) % images.length)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-none cursor-pointer hover:bg-white/30 transition-colors">
                    <ChevronRight size={20} className="text-white" />
                  </button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {images.map((_, i) => (
                      <button key={i} onClick={() => setActiveImage(i)}
                        className={`rounded-full border-none cursor-pointer transition-all ${i === activeImage ? "w-6 h-2 bg-white" : "w-2 h-2 bg-white/50"}`} />
                    ))}
                  </div>
                </>
              )}

              {/* thumbnails */}
              {images.length > 1 && (
                <div className="absolute bottom-4 right-4 flex gap-2">
                  {images.slice(0, 4).map((img, i) => (
                    <div key={i} onClick={() => setActiveImage(i)}
                      className={`w-14 h-14 rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${i === activeImage ? "border-white" : "border-transparent opacity-70"}`}>
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-neutral-300">No images available</span>
            </div>
          )}
        </div>

        <div className="px-[5%] py-10 max-w-300 mx-auto">
          <div className="grid grid-cols-[1fr_360px] gap-10">

            {/* LEFT */}
            <div>
              {/* HOTEL INFO */}
              <div className="mb-8">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h1 className="text-3xl font-extrabold text-brand-dark tracking-tight mb-2">{selectedHotel.name}</h1>
                    <p className="text-neutral-400 text-sm flex items-center gap-1.5">
                      <MapPin size={14} className="text-brand" />
                      {selectedHotel.city}, {selectedHotel.country}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 bg-brand/10 px-4 py-2 rounded-xl">
                    <Star size={16} className="fill-brand text-brand" />
                    <span className="font-extrabold text-brand text-lg">{Number(selectedHotel.rating).toFixed(1)}</span>
                    <span className="text-neutral-400 text-sm">({selectedHotel.totalReviews} reviews)</span>
                  </div>
                </div>

                {selectedHotel.description && (
                  <p className="text-neutral-500 text-sm leading-relaxed">{selectedHotel.description}</p>
                )}
              </div>

              {/* AMENITIES */}
              <div className="mb-8">
                <h2 className="text-lg font-bold text-brand-dark mb-4">Amenities</h2>
                <div className="grid grid-cols-3 gap-3">
                  {(selectedHotel.amenities as string[]).map(amenity => {
                    const Icon = AMENITY_ICONS[amenity] || Coffee;
                    return (
                      <div key={amenity} className="flex items-center gap-2.5 bg-white border border-neutral-100 rounded-xl px-4 py-3">
                        <Icon size={16} className="text-brand shrink-0" />
                        <span className="text-sm text-brand-dark font-medium capitalize">{amenity}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ROOMS */}
              <div>
                <h2 className="text-lg font-bold text-brand-dark mb-4">Available Rooms</h2>
                {rooms.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-neutral-100 p-8 text-center">
                    <p className="text-neutral-400 text-sm">No rooms available at the moment</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {rooms.map(room => (
                      <div key={room.id} className="bg-white rounded-2xl border border-neutral-100 overflow-hidden hover:shadow-md transition-shadow">
                        <div className="flex">
                          {/* room image */}
                          <div className="w-45 h-35 bg-neutral-100 shrink-0">
                            {room.images?.[0] ? (
                              <img src={room.images[0]} alt={room.roomType} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <span className="text-neutral-300 text-xs">No image</span>
                              </div>
                            )}
                          </div>

                          {/* room info */}
                          <div className="flex-1 p-5 flex items-center justify-between">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-bold text-brand-dark text-base">Room {room.roomNumber}</h3>
                                <span className="text-xs bg-brand/10 text-brand px-2 py-0.5 rounded-full font-semibold">{room.roomType}</span>
                              </div>
                              <p className="text-neutral-400 text-sm flex items-center gap-1 mb-3">
                                <Users size={13} /> Up to {room.maxOccupancy} guests
                              </p>
                              <div className="flex items-baseline gap-1">
                                <span className="text-2xl font-extrabold text-brand">₹{Number(room.pricePerNight).toLocaleString()}</span>
                                <span className="text-neutral-400 text-sm">/night</span>
                              </div>
                            </div>
                            <button onClick={() => handleBookRoom(room.id)}
                              className="bg-brand-dark text-white border-none px-6 py-3 rounded-xl text-sm font-bold cursor-pointer hover:bg-brand transition-colors">
                              Book Now
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT — STICKY CARD */}
            <div>
              <div className="sticky top-22.5 bg-white rounded-2xl border border-neutral-100 p-6 shadow-sm">
                <p className="text-neutral-400 text-sm mb-1">Starting from</p>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-3xl font-extrabold text-brand">
                    ₹{rooms.length > 0 ? Math.min(...rooms.map(r => Number(r.pricePerNight))).toLocaleString() : "—"}
                  </span>
                  <span className="text-neutral-400 text-sm">/night</span>
                </div>

                <div className="flex flex-col gap-3 mb-5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Location</span>
                    <span className="font-semibold text-brand-dark">{selectedHotel.city}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Rating</span>
                    <span className="font-semibold text-brand-dark flex items-center gap-1">
                      <Star size={12} className="fill-amber-400 text-amber-400" />
                      {Number(selectedHotel.rating).toFixed(1)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Available Rooms</span>
                    <span className="font-semibold text-brand-dark">{rooms.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Reviews</span>
                    <span className="font-semibold text-brand-dark">{selectedHotel.totalReviews}</span>
                  </div>
                </div>

                <button onClick={() => document.querySelector("#rooms")?.scrollIntoView({ behavior: "smooth" })}
                  className="w-full py-3.5 bg-brand-dark text-white rounded-xl text-sm font-bold border-none cursor-pointer hover:bg-brand transition-colors">
                  View All Rooms
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelDetail;