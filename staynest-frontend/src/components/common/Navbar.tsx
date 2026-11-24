import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { LogOut, User, LayoutDashboard } from "lucide-react";
import { resetAuth, signOut } from "../../store/slices/authSlice";
import type { AppDispatch, RootState } from "../../store";

type Props = {
  transparent?: boolean;
};

const Navbar = ({ transparent = false }: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const [isScrolled, setIsScrolled] = useState(!transparent);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    if (!transparent) return;
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [transparent]);

//   const handleSignOut = async () => {
//     await dispatch(signOut());
//     navigate("/login");
//   };

  const handleSignOut = async () => {
  dispatch(resetAuth()); // ✅ clear state immediately
  navigate("/login");
};

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 px-[5%] h-17.5 flex items-center justify-between transition-all duration-300 ${isScrolled ? "bg-white/95 backdrop-blur-md border-b border-black/8" : "bg-transparent"}`}>

      {/* LOGO */}
      <Link to="/" className="flex items-center gap-2 no-underline">
        <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center">
          <span className="text-white text-sm font-bold">S</span>
        </div>
        <span className={`font-bold text-lg ${isScrolled ? "text-brand-dark" : "text-white"}`}>StayNest</span>
      </Link>

      {/* LINKS */}
      <div className="flex gap-8">
        {[{ label: "Home", path: "/" }, { label: "Hotels", path: "/hotels" }].map(item => (
          <Link key={item.path} to={item.path}
            className={`text-sm font-medium no-underline transition-colors ${isScrolled ? "text-neutral-600 hover:text-brand-dark" : "text-white/90 hover:text-white"}`}>
            {item.label}
          </Link>
        ))}
      </div>

      {/* AUTH */}
      <div className="flex items-center gap-3">
        {!isAuthenticated ? (
          <>
            <Link to="/login"
              className={`bg-transparent border-[1.5px] px-5 py-2 rounded-full text-sm font-semibold no-underline transition-all ${isScrolled ? "border-brand-dark text-brand-dark" : "border-white text-white"}`}>
              Sign In
            </Link>
            <Link to="/register"
              className="bg-brand border-none text-white px-5 py-2 rounded-full text-sm font-semibold no-underline cursor-pointer">
              Get Started
            </Link>
          </>
        ) : (
          <div className="relative">
            <button onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 bg-transparent border-none cursor-pointer">
              <div className="w-9 h-9 rounded-full bg-brand flex items-center justify-center">
                <span className="text-white text-sm font-bold">
                  {user?.firstname?.[0]}{user?.lastname?.[0]}
                </span>
              </div>
              <span className={`text-sm font-semibold ${isScrolled ? "text-brand-dark" : "text-white"}`}>
                {user?.firstname}
              </span>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 top-12 bg-white rounded-2xl border border-neutral-100 shadow-xl w-50 overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-neutral-100">
                  <p className="text-sm font-bold text-brand-dark m-0">{user?.firstname} {user?.lastname}</p>
                  <p className="text-xs text-neutral-400 m-0">{user?.email}</p>
                </div>
                <div className="py-2">
                  <button onClick={() => { navigate(user?.role === "OWNER" ? "/dashboard/hotels" : "/dashboard/bookings"); setDropdownOpen(false); }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-brand-dark hover:bg-neutral-50 transition-colors bg-transparent border-none cursor-pointer">
                    <LayoutDashboard size={15} className="text-neutral-400" /> Dashboard
                  </button>
                  <button onClick={() => { navigate("/dashboard/profile"); setDropdownOpen(false); }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-brand-dark hover:bg-neutral-50 transition-colors bg-transparent border-none cursor-pointer">
                    <User size={15} className="text-neutral-400" /> Profile
                  </button>
                  <div className="border-t border-neutral-100 mt-1 pt-1">
                    <button onClick={handleSignOut}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors bg-transparent border-none cursor-pointer">
                      <LogOut size={15} /> Sign Out
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;