import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ArrowLeft, Plus, X, Trash2,
  BedDouble, Users, DollarSign, Hash,
} from "lucide-react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { getRoomsByHotel, createRoom, deleteRoom } from "../../store/slices/roomSlice";
import { getHotelById } from "../../store/slices/hotelSlice";
import type { AppDispatch, RootState } from "../../store";

const schema = z.object({
  roomNumber: z.string().min(1, "Room number is required"),
  roomType: z.string().min(2, "Room type is required"),
  pricePerNight: z.string().min(1, "Price is required"),
  maxOccupancy: z.string().min(1, "Occupancy is required"),
});

type FormData = z.infer<typeof schema>;

const ROOM_TYPES = ["Standard", "Deluxe", "Suite", "Presidential", "Family", "Studio"];

const ManageRooms = () => {
  const { id: hotelId } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { rooms, isLoading, error } = useSelector((state: RootState) => state.room);
  const { selectedHotel } = useSelector((state: RootState) => state.hotel);
  const [showForm, setShowForm] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (hotelId) {
      dispatch(getRoomsByHotel(hotelId));
      dispatch(getHotelById(hotelId));
    }
  }, [hotelId, dispatch]);

const onSubmit = async (data: FormData) => {
  const result = await dispatch(createRoom({
    hotelId: hotelId!,
    roomNumber: data.roomNumber,
    roomType: data.roomType,
    pricePerNight: Number(data.pricePerNight), // ✅ convert here
    maxOccupancy: Number(data.maxOccupancy),   // ✅ convert here
  }));

  if (createRoom.fulfilled.match(result)) {
    reset();
    setShowForm(false);
  }
};
  const handleDelete = (roomId: string) => {
    if (confirm("Are you sure you want to delete this room?")) {
      dispatch(deleteRoom(roomId));
    }
  };

  return (
    <DashboardLayout>
      <div className="p-8">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate("/dashboard/hotels")}
              className="w-9 h-9 rounded-xl bg-white border border-neutral-200 flex items-center justify-center cursor-pointer hover:bg-neutral-50 transition-colors">
              <ArrowLeft size={16} className="text-brand-dark" />
            </button>
            <div>
              <h1 className="text-2xl font-extrabold text-brand-dark tracking-tight m-0">Manage Rooms</h1>
              <p className="text-neutral-400 text-sm mt-1 m-0">{selectedHotel?.name}</p>
            </div>
          </div>
          <button onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-brand text-white border-none px-5 py-2.5 rounded-xl text-sm font-bold cursor-pointer hover:bg-brand/90 transition-colors">
            {showForm ? <X size={16} /> : <Plus size={16} />}
            {showForm ? "Cancel" : "Add Room"}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-6">
            <p className="text-red-600 text-sm m-0">{error}</p>
          </div>
        )}

        {/* ADD ROOM FORM */}
        {showForm && (
          <div className="bg-white rounded-2xl border border-neutral-100 p-6 mb-8">
            <h2 className="text-base font-bold text-brand-dark mb-5">Add New Room</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
              <div className="grid grid-cols-2 gap-4">
                {/* room number */}
                <div>
                  <label className="block text-[13px] font-semibold text-brand-dark mb-2">Room Number *</label>
                  <div className="relative">
                    <Hash size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input {...register("roomNumber")} placeholder="e.g. 101"
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border-[1.5px] bg-white text-sm outline-none text-brand-dark placeholder:text-neutral-300 transition-colors ${errors.roomNumber ? "border-red-300" : "border-neutral-200 focus:border-brand"}`} />
                  </div>
                  {errors.roomNumber && <p className="text-red-500 text-xs mt-1.5">{errors.roomNumber.message}</p>}
                </div>

                {/* room type */}
                <div>
                  <label className="block text-[13px] font-semibold text-brand-dark mb-2">Room Type *</label>
                  <div className="relative">
                    <BedDouble size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <select {...register("roomType")}
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border-[1.5px] bg-white text-sm outline-none text-brand-dark transition-colors appearance-none ${errors.roomType ? "border-red-300" : "border-neutral-200 focus:border-brand"}`}>
                      <option value="">Select type</option>
                      {ROOM_TYPES.map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  {errors.roomType && <p className="text-red-500 text-xs mt-1.5">{errors.roomType.message}</p>}
                </div>

                {/* price */}
                <div>
                  <label className="block text-[13px] font-semibold text-brand-dark mb-2">Price Per Night (₹) *</label>
                  <div className="relative">
                    <DollarSign size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input {...register("pricePerNight")} type="number" placeholder="e.g. 2999"
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border-[1.5px] bg-white text-sm outline-none text-brand-dark placeholder:text-neutral-300 transition-colors ${errors.pricePerNight ? "border-red-300" : "border-neutral-200 focus:border-brand"}`} />
                  </div>
                  {errors.pricePerNight && <p className="text-red-500 text-xs mt-1.5">{errors.pricePerNight.message}</p>}
                </div>

                {/* max occupancy */}
                <div>
                  <label className="block text-[13px] font-semibold text-brand-dark mb-2">Max Occupancy *</label>
                  <div className="relative">
                    <Users size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input {...register("maxOccupancy")} type="number" placeholder="e.g. 2"
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border-[1.5px] bg-white text-sm outline-none text-brand-dark placeholder:text-neutral-300 transition-colors ${errors.maxOccupancy ? "border-red-300" : "border-neutral-200 focus:border-brand"}`} />
                  </div>
                  {errors.maxOccupancy && <p className="text-red-500 text-xs mt-1.5">{errors.maxOccupancy.message}</p>}
                </div>
              </div>

              {/* submit */}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => { setShowForm(false); reset(); }}
                  className="flex-1 py-3 rounded-xl bg-neutral-100 text-brand-dark text-sm font-bold border-none cursor-pointer hover:bg-neutral-200 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={isLoading}
                  className={`flex-1 py-3 rounded-xl text-white text-sm font-bold border-none cursor-pointer transition-colors ${isLoading ? "bg-neutral-400 cursor-not-allowed" : "bg-brand-dark hover:bg-brand"}`}>
                  {isLoading ? "Adding..." : "Add Room"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* LOADING */}
        {isLoading && rooms.length === 0 && (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* EMPTY */}
        {!isLoading && rooms.length === 0 && !showForm && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-brand/10 rounded-2xl flex items-center justify-center mb-4">
              <BedDouble size={32} className="text-brand" />
            </div>
            <h3 className="text-lg font-bold text-brand-dark mb-2">No rooms yet</h3>
            <p className="text-neutral-400 text-sm mb-6">Add rooms to start accepting bookings</p>
            <button onClick={() => setShowForm(true)}
              className="flex items-center gap-2 bg-brand text-white border-none px-5 py-2.5 rounded-xl text-sm font-bold cursor-pointer">
              <Plus size={16} /> Add First Room
            </button>
          </div>
        )}

        {/* ROOMS TABLE */}
        {rooms.length > 0 && (
          <div className="bg-white rounded-2xl border border-neutral-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between">
              <h2 className="text-sm font-bold text-brand-dark m-0">{rooms.length} Rooms</h2>
            </div>

            <div className="divide-y divide-neutral-100">
              {rooms.map(room => (
                <div key={room.id} className="flex items-center gap-4 px-6 py-4 hover:bg-neutral-50 transition-colors">

                  {/* image */}
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-neutral-100 shrink-0">
                    {room.images?.[0] ? (
                      <img src={room.images[0]} alt={room.roomType} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BedDouble size={20} className="text-neutral-300" />
                      </div>
                    )}
                  </div>

                  {/* info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-brand-dark text-sm">Room {room.roomNumber}</span>
                      <span className="text-[11px] bg-brand/10 text-brand px-2 py-0.5 rounded-full font-semibold">{room.roomType}</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-neutral-400">
                      <span className="flex items-center gap-1"><Users size={11} /> {room.maxOccupancy} guests</span>
                      <span className="flex items-center gap-1 text-brand font-bold text-sm">₹{Number(room.pricePerNight).toLocaleString()}/night</span>
                    </div>
                  </div>

                  {/* actions */}
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => handleDelete(room.id)}
                      className="flex items-center gap-1.5 bg-red-50 text-red-500 border-none px-3 py-2 rounded-xl text-xs font-bold cursor-pointer hover:bg-red-100 transition-colors">
                      <Trash2 size={13} /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ManageRooms;