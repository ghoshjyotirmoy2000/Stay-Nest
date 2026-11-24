import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, MapPin, Building2, FileText } from "lucide-react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { getHotelById, updateHotel } from "../../store/slices/hotelSlice";
import type { AppDispatch, RootState } from "../../store";

const AMENITIES_LIST = [
  "wifi", "pool", "gym", "spa", "parking", "restaurant",
  "bar", "roomservice", "laundry", "conferenceroom",
  "kidsplayarea", "garden", "evcharging", "security",
  "livemusic", "sauna", "steamroom", "workspace",
];

const schema = z.object({
  name: z.string().min(2, "Hotel name must be at least 2 characters"),
  description: z.string().optional(),
  city: z.string().min(2, "City must be at least 2 characters"),
  country: z.string().min(2, "Country must be at least 2 characters"),
});

type FormData = z.infer<typeof schema>;

const EditHotel = () => {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { selectedHotel, isLoading, error } = useSelector((state: RootState) => state.hotel);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  // fetch hotel and prefill form
  useEffect(() => {
    if (id) dispatch(getHotelById(id));
  }, [id, dispatch]);

  useEffect(() => {
    if (selectedHotel) {
      reset({
        name: selectedHotel.name,
        description: selectedHotel.description || "",
        city: selectedHotel.city,
        country: selectedHotel.country,
      });
      setSelectedAmenities(selectedHotel.amenities as string[]);
    }
  }, [selectedHotel, reset]);

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev =>
      prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
    );
  };

  const onSubmit = async (data: FormData) => {
    if (selectedAmenities.length === 0) return alert("Please select at least one amenity");

    const result = await dispatch(updateHotel({
      hotelId: id!,
      data: { ...data, amenities: selectedAmenities },
    }));

    if (updateHotel.fulfilled.match(result)) {
      navigate("/dashboard/hotels");
    }
  };

  if (isLoading && !selectedHotel) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-8 max-w-[800px]">

        {/* HEADER */}
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate("/dashboard/hotels")}
            className="w-9 h-9 rounded-xl bg-white border border-neutral-200 flex items-center justify-center cursor-pointer hover:bg-neutral-50 transition-colors">
            <ArrowLeft size={16} className="text-brand-dark" />
          </button>
          <div>
            <h1 className="text-2xl font-extrabold text-brand-dark tracking-tight m-0">Edit Hotel</h1>
            <p className="text-neutral-400 text-sm mt-1 m-0">{selectedHotel?.name}</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-6">
            <p className="text-red-600 text-sm m-0">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">

          {/* BASIC INFO */}
          <div className="bg-white rounded-2xl border border-neutral-100 p-6">
            <div className="flex items-center gap-2 mb-5">
              <Building2 size={18} className="text-brand" />
              <h2 className="text-base font-bold text-brand-dark m-0">Basic Information</h2>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-[13px] font-semibold text-brand-dark mb-2">Hotel Name *</label>
                <input {...register("name")} placeholder="e.g. Grand Palace Hotel"
                  className={`w-full px-4 py-3 rounded-xl border-[1.5px] bg-white text-sm outline-none text-brand-dark placeholder:text-neutral-300 transition-colors ${errors.name ? "border-red-300" : "border-neutral-200 focus:border-brand"}`} />
                {errors.name && <p className="text-red-500 text-xs mt-1.5">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-brand-dark mb-2">Description</label>
                <textarea {...register("description")} placeholder="Describe your hotel..." rows={4}
                  className="w-full px-4 py-3 rounded-xl border-[1.5px] border-neutral-200 bg-white text-sm outline-none text-brand-dark placeholder:text-neutral-300 focus:border-brand transition-colors resize-none" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-semibold text-brand-dark mb-2">City *</label>
                  <div className="relative">
                    <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input {...register("city")} placeholder="e.g. Mumbai"
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border-[1.5px] bg-white text-sm outline-none text-brand-dark placeholder:text-neutral-300 transition-colors ${errors.city ? "border-red-300" : "border-neutral-200 focus:border-brand"}`} />
                  </div>
                  {errors.city && <p className="text-red-500 text-xs mt-1.5">{errors.city.message}</p>}
                </div>
                <div>
                  <label className="block text-[13px] font-semibold text-brand-dark mb-2">Country *</label>
                  <input {...register("country")} placeholder="e.g. India"
                    className={`w-full px-4 py-3 rounded-xl border-[1.5px] bg-white text-sm outline-none text-brand-dark placeholder:text-neutral-300 transition-colors ${errors.country ? "border-red-300" : "border-neutral-200 focus:border-brand"}`} />
                  {errors.country && <p className="text-red-500 text-xs mt-1.5">{errors.country.message}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* AMENITIES */}
          <div className="bg-white rounded-2xl border border-neutral-100 p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <FileText size={18} className="text-brand" />
                <h2 className="text-base font-bold text-brand-dark m-0">Amenities *</h2>
              </div>
              <span className="text-xs text-neutral-400">{selectedAmenities.length} selected</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {AMENITIES_LIST.map(amenity => (
                <button key={amenity} type="button" onClick={() => toggleAmenity(amenity)}
                  className={`px-3 py-1.5 rounded-xl text-[13px] font-medium cursor-pointer border transition-all capitalize ${selectedAmenities.includes(amenity) ? "bg-brand text-white border-brand" : "bg-neutral-50 text-neutral-600 border-neutral-200 hover:border-brand hover:text-brand"}`}>
                  {amenity}
                </button>
              ))}
            </div>
          </div>

          {/* SUBMIT */}
          <div className="flex gap-3">
            <button type="button" onClick={() => navigate("/dashboard/hotels")}
              className="flex-1 py-3.5 rounded-xl bg-white border border-neutral-200 text-brand-dark text-sm font-bold cursor-pointer hover:bg-neutral-50 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={isLoading}
              className={`flex-1 py-3.5 rounded-xl text-white text-sm font-bold border-none cursor-pointer transition-colors ${isLoading ? "bg-neutral-400 cursor-not-allowed" : "bg-brand-dark hover:bg-brand"}`}>
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default EditHotel;