import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import { signIn } from "../../store/slices/authSlice";
import type { AppDispatch, RootState } from "../../store";

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormData = z.infer<typeof schema>;

const Login = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isLoading, error, isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === "OWNER") navigate("/dashboard/hotels");
      else if (user.role === "SUPERADMIN") navigate("/dashboard/admin/hotel-admins");
      else navigate("/");
    }
  }, [isAuthenticated, user, navigate]);

  const onSubmit = (data: FormData) => {
    dispatch(signIn(data));
  };

  return (
    <div className="min-h-screen bg-page flex font-sans">

      {/* LEFT — DECORATIVE */}
      <div className="flex-1 bg-brand-dark flex flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-brand/15" />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-brand-lime/10" />

        {/* logo */}
        <div className="flex items-center gap-2.5 relative z-10">
          <div className="w-9 h-9 bg-brand rounded-xl flex items-center justify-center">
            <span className="text-white text-base font-bold">S</span>
          </div>
          <span className="text-white text-xl font-bold">StayNest</span>
        </div>

        {/* content */}
        <div className="relative z-10">
          <div className="inline-block bg-brand rounded-full px-4 py-1.5 mb-6">
            <span className="text-white text-xs font-bold uppercase tracking-wider">Welcome Back</span>
          </div>
          <h2 className="text-white text-[40px] font-extrabold leading-[1.2] mb-4 tracking-tight">
            Your next stay<br />is one click away.
          </h2>
          <p className="text-white/50 text-base leading-relaxed max-w-85">
            Sign in to manage your bookings, explore new hotels, and continue your journey with StayNest.
          </p>
        </div>

        {/* stats */}
        <div className="flex gap-8 relative z-10">
          {[{ value: "124K+", label: "Happy Guests" }, { value: "2.4K+", label: "Hotels" }, { value: "4.8", label: "Avg Rating" }].map(stat => (
            <div key={stat.label}>
              <p className="text-white text-2xl font-extrabold mb-1">{stat.value}</p>
              <p className="text-white/40 text-[13px]">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT — FORM */}
      <div className="flex-1 flex items-center justify-center p-12">
        <div className="w-full max-w-105">
          <h1 className="text-[32px] font-extrabold text-brand-dark mb-2 tracking-tight">Sign in</h1>
          <p className="text-neutral-400 text-[15px] mb-10">
            Don't have an account?{" "}
            <Link to="/register" className="text-brand font-semibold no-underline">Create one</Link>
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-6">
              <p className="text-red-600 text-sm m-0">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
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
              {isLoading ? "Signing in..." : <> Sign In <ArrowRight size={16} /> </>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;