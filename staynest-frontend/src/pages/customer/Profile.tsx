import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { User, Mail, Phone, Shield, Save } from "lucide-react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { getMe } from "../../store/slices/authSlice";
import type { AppDispatch, RootState } from "../../store";
import api from "../../api/axiosInstance";
import { useState } from "react";

const schema = z.object({
  firstname: z.string().min(2, "First name must be at least 2 characters"),
  lastname: z.string().min(2, "Last name must be at least 2 characters"),
  phone: z.string().length(10, "Phone must be 10 digits").regex(/^[0-9]+$/, "Only digits allowed"),
});

type FormData = z.infer<typeof schema>;

const Profile = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (user) {
      reset({
        firstname: user.firstname,
        lastname: user.lastname,
        phone: user.phone,
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await api.patch("/user/update-user", data);
      await dispatch(getMe());
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-8 max-w-[600px]">

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-brand-dark tracking-tight m-0">My Profile</h1>
          <p className="text-neutral-400 text-sm mt-1 m-0">Manage your personal information</p>
        </div>

        {/* AVATAR */}
        <div className="bg-white rounded-2xl border border-neutral-100 p-6 mb-6 flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-brand flex items-center justify-center shrink-0">
            <span className="text-white text-2xl font-extrabold">
              {user?.firstname?.[0]}{user?.lastname?.[0]}
            </span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-brand-dark m-0">{user?.firstname} {user?.lastname}</h2>
            <p className="text-neutral-400 text-sm m-0 mt-1">{user?.email}</p>
            <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full mt-2 ${user?.role === "OWNER" ? "bg-brand/10 text-brand" : "bg-blue-50 text-blue-600"}`}>
              <Shield size={11} /> {user?.role}
            </span>
          </div>
        </div>

        {/* SUCCESS */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-6">
            <p className="text-green-600 text-sm m-0 font-semibold">✓ Profile updated successfully!</p>
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-6">
            <p className="text-red-600 text-sm m-0">{error}</p>
          </div>
        )}

        {/* FORM */}
        <div className="bg-white rounded-2xl border border-neutral-100 p-6">
          <h2 className="text-base font-bold text-brand-dark mb-5 flex items-center gap-2">
            <User size={18} className="text-brand" /> Personal Information
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">

            {/* name */}
            <div className="grid grid-cols-2 gap-4">
              {(["firstname", "lastname"] as const).map(field => (
                <div key={field}>
                  <label className="block text-[13px] font-semibold text-brand-dark mb-2">
                    {field === "firstname" ? "First Name" : "Last Name"}
                  </label>
                  <div className="relative">
                    <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input {...register(field)}
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border-[1.5px] bg-white text-sm outline-none text-brand-dark transition-colors ${errors[field] ? "border-red-300" : "border-neutral-200 focus:border-brand"}`} />
                  </div>
                  {errors[field] && <p className="text-red-500 text-xs mt-1.5">{errors[field]?.message}</p>}
                </div>
              ))}
            </div>

            {/* email — readonly */}
            <div>
              <label className="block text-[13px] font-semibold text-brand-dark mb-2">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input value={user?.email || ""} readOnly
                  className="w-full pl-10 pr-4 py-3 rounded-xl border-[1.5px] border-neutral-200 bg-neutral-50 text-sm text-neutral-400 cursor-not-allowed outline-none" />
              </div>
              <p className="text-neutral-400 text-xs mt-1.5">Email cannot be changed</p>
            </div>

            {/* phone */}
            <div>
              <label className="block text-[13px] font-semibold text-brand-dark mb-2">Phone</label>
              <div className="relative">
                <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input {...register("phone")} placeholder="9876543210"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border-[1.5px] bg-white text-sm outline-none text-brand-dark transition-colors ${errors.phone ? "border-red-300" : "border-neutral-200 focus:border-brand"}`} />
              </div>
              {errors.phone && <p className="text-red-500 text-xs mt-1.5">{errors.phone.message}</p>}
            </div>

            <button type="submit" disabled={isLoading}
              className={`flex items-center justify-center gap-2 py-3.5 rounded-xl text-white text-sm font-bold border-none cursor-pointer transition-colors mt-2 ${isLoading ? "bg-neutral-400 cursor-not-allowed" : "bg-brand-dark hover:bg-brand"}`}>
              <Save size={16} />
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>

        {/* ACCOUNT INFO */}
        <div className="bg-white rounded-2xl border border-neutral-100 p-6 mt-6">
          <h2 className="text-base font-bold text-brand-dark mb-4 flex items-center gap-2">
            <Shield size={18} className="text-brand" /> Account Information
          </h2>
          <div className="flex flex-col gap-3 text-sm">
            <div className="flex justify-between py-2 border-b border-neutral-100">
              <span className="text-neutral-400">Account Type</span>
              <span className="font-semibold text-brand-dark">{user?.role}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-neutral-100">
              <span className="text-neutral-400">User ID</span>
              <span className="font-semibold text-brand-dark text-xs">{user?.id?.slice(0, 16)}...</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-neutral-400">Email</span>
              <span className="font-semibold text-brand-dark">{user?.email}</span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;