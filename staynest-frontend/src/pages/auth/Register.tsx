import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight, Building2, UserCircle } from "lucide-react";
import { signUp, signIn } from "../../store/slices/authSlice";
import type { AppDispatch, RootState } from "../../store";

const schema = z.object({
  firstname: z.string().min(2, "First name must be at least 2 characters"),
  lastname: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().length(10, "Phone must be 10 digits").regex(/^[0-9]+$/, "Only digits allowed"),
  role: z.enum(["CUSTOMER", "OWNER"]),
});

type FormData = z.infer<typeof schema>;

const Register = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isLoading, error, isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<"CUSTOMER" | "OWNER">("CUSTOMER");

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { role: "CUSTOMER" },
  });

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(user.role === "OWNER" ? "/dashboard/hotels" : "/");
    }
  }, [isAuthenticated, user, navigate]);

  const handleRoleSelect = (role: "CUSTOMER" | "OWNER") => {
    setSelectedRole(role);
    setValue("role", role);
  };

  const onSubmit = async (data: FormData) => {
    const result = await dispatch(signUp(data));
    if (signUp.fulfilled.match(result)) {
      dispatch(signIn({ email: data.email, password: data.password }));
    }
  };

  return (
    <div className="min-h-screen bg-page flex font-sans">

      {/* LEFT — FORM */}
      <div className="flex-1 flex items-center justify-center p-12 overflow-y-auto">
        <div className="w-full max-w-120 py-8">
          <div className="flex items-center gap-2.5 mb-10">
            <div className="w-9 h-9 bg-brand rounded-xl flex items-center justify-center">
              <span className="text-white text-base font-bold">S</span>
            </div>
            <span className="text-xl font-bold text-brand-dark">StayNest</span>
          </div>

          <h1 className="text-[32px] font-extrabold text-brand-dark mb-2 tracking-tight">Create account</h1>
          <p className="text-neutral-400 text-[15px] mb-8">
            Already have an account?{" "}
            <Link to="/login" className="text-brand font-semibold no-underline">Sign in</Link>
          </p>

          {/* ROLE SELECTOR */}
          <div className="mb-7">
            <label className="block text-[13px] font-semibold text-brand-dark mb-2.5">I am a</label>
            <div className="grid grid-cols-2 gap-3">
              {([
                { value: "CUSTOMER", label: "Guest", desc: "I want to book hotels", icon: UserCircle },
                { value: "OWNER", label: "Hotel Owner", desc: "I want to list my hotel", icon: Building2 },
              ] as const).map(({ value, label, desc, icon: Icon }) => (
                <button key={value} type="button" onClick={() => handleRoleSelect(value)}
                  className={`p-4 rounded-xl border-2 cursor-pointer text-left transition-all ${selectedRole === value ? "border-brand bg-brand-light" : "border-neutral-200 bg-white"}`}>
                  <Icon size={20} className={selectedRole === value ? "text-brand" : "text-neutral-400"} />
                  <p className={`text-sm font-bold mt-2 mb-1 ${selectedRole === value ? "text-brand" : "text-brand-dark"}`}>{label}</p>
                  <p className="text-xs text-neutral-400 m-0">{desc}</p>
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-6">
              <p className="text-red-600 text-sm m-0">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            {/* name row */}
            <div className="grid grid-cols-2 gap-3">
              {(["firstname", "lastname"] as const).map(field => (
                <div key={field}>
                  <label className="block text-[13px] font-semibold text-brand-dark mb-2">
                    {field === "firstname" ? "First Name" : "Last Name"}
                  </label>
                  <div className="relative">
                    <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input {...register(field)} placeholder={field === "firstname" ? "John" : "Doe"}
                      className={`w-full pl-9 pr-3 py-3 rounded-xl border-[1.5px] bg-white text-sm outline-none text-brand-dark placeholder:text-neutral-300 transition-colors ${errors[field] ? "border-red-300" : "border-neutral-200 focus:border-brand"}`} />
                  </div>
                  {errors[field] && <p className="text-red-500 text-[11px] mt-1">{errors[field]?.message}</p>}
                </div>
              ))}
            </div>

            {/* email */}
            <div>
              <label className="block text-[13px] font-semibold text-brand-dark mb-2">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input {...register("email")} type="email" placeholder="you@example.com"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border-[1.5px] bg-white text-sm outline-none text-brand-dark placeholder:text-neutral-300 transition-colors ${errors.email ? "border-red-300" : "border-neutral-200 focus:border-brand"}`} />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1.5">{errors.email.message}</p>}
            </div>

            {/* phone */}
            <div>
              <label className="block text-[13px] font-semibold text-brand-dark mb-2">Phone</label>
              <div className="relative">
                <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input {...register("phone")} placeholder="9876543210"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border-[1.5px] bg-white text-sm outline-none text-brand-dark placeholder:text-neutral-300 transition-colors ${errors.phone ? "border-red-300" : "border-neutral-200 focus:border-brand"}`} />
              </div>
              {errors.phone && <p className="text-red-500 text-xs mt-1.5">{errors.phone.message}</p>}
            </div>

            {/* password */}
            <div>
              <label className="block text-[13px] font-semibold text-brand-dark mb-2">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input {...register("password")} type={showPassword ? "text" : "password"} placeholder="••••••••"
                  className={`w-full pl-10 pr-10 py-3 rounded-xl border-[1.5px] bg-white text-sm outline-none text-brand-dark transition-colors ${errors.password ? "border-red-300" : "border-neutral-200 focus:border-brand"}`} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 bg-none border-none cursor-pointer p-0">
                  {showPassword ? <EyeOff size={16} className="text-neutral-400" /> : <Eye size={16} className="text-neutral-400" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1.5">{errors.password.message}</p>}
            </div>

            <button type="submit" disabled={isLoading}
              className={`w-full py-3.5 rounded-xl text-white text-[15px] font-bold border-none flex items-center justify-center gap-2 transition-colors cursor-pointer mt-2 ${isLoading ? "bg-neutral-400 cursor-not-allowed" : "bg-brand-dark hover:bg-brand"}`}>
              {isLoading ? "Creating account..." : <> Create Account <ArrowRight size={16} /> </>}
            </button>
          </form>
        </div>
      </div>

      {/* RIGHT — DECORATIVE */}
      <div className="flex-1 bg-brand-dark flex flex-col justify-center p-12 relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-brand/15" />
        <div className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full bg-brand-lime/10" />

        <div className="relative z-10">
          <div className="inline-block bg-brand-lime rounded-full px-4 py-1.5 mb-6">
            <span className="text-brand-dark text-xs font-bold uppercase tracking-wider">Join StayNest</span>
          </div>
          <h2 className="text-white text-[40px] font-extrabold leading-[1.2] mb-4 tracking-tight">
            Find your perfect<br />home away from home.
          </h2>
          <p className="text-white/50 text-base leading-relaxed mb-12 max-w-85">
            Whether you're a traveller or an owner wanting to list your property — StayNest has you covered.
          </p>

          {["Book from 2,400+ verified hotels", "Dynamic pricing — always fair", "Free cancellation on most stays", "24/7 customer support"].map((item, i) => (
            <div key={i} className="flex items-center gap-3 mb-4">
              <div className="w-6 h-6 rounded-full bg-brand flex items-center justify-center shrink-0">
                <span className="text-white text-xs font-bold">✓</span>
              </div>
              <p className="text-white/70 text-sm m-0">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Register;