import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  LayoutDashboard,
  Hotel,
  PlusSquare,
  BarChart3,
  User,
  LogOut,
  Menu,
  X,
  ChevronRight,
  CalendarDays,
  Star,
  ShieldCheck,
  Users,
} from "lucide-react";
import { resetAuth, signOut } from "../../store/slices/authSlice";
import type { AppDispatch, RootState } from "../../store";

const OWNER_LINKS = [
  { label: "My Hotels", path: "/dashboard/hotels", icon: Hotel },
  { label: "Add Hotel", path: "/dashboard/hotels/create", icon: PlusSquare },
  { label: "Analytics", path: "/dashboard/analytics", icon: BarChart3 },
  { label: "Profile", path: "/dashboard/profile", icon: User },
];

const CUSTOMER_LINKS = [
  { label: "My Bookings", path: "/dashboard/bookings", icon: CalendarDays },
  { label: "My Reviews", path: "/dashboard/reviews", icon: Star },
  { label: "Profile", path: "/dashboard/profile", icon: User },
];

const SUPERADMIN_LINKS = [
  { label: "Hotel Admins", path: "/dashboard/admin/hotel-admins", icon: ShieldCheck },
  { label: "All Users", path: "/dashboard/admin/users", icon: Users },
];

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const [collapsed, setCollapsed] = useState(false);
  const links =
    user?.role === "OWNER" ? OWNER_LINKS :
    user?.role === "SUPERADMIN" ? SUPERADMIN_LINKS :
    CUSTOMER_LINKS;

//   const handleSignOut = async () => {
//     await dispatch(signOut());
//     navigate("/login");
//   };

  const handleSignOut = () => {
  dispatch(resetAuth()); // ✅ clear state immediately
  navigate("/login");
};

  return (
    <aside
      className={`h-screen bg-brand-dark flex flex-col sticky top-0 transition-all duration-300 ${collapsed ? "w-[72px]" : "w-[240px]"}`}
    >
      {/* LOGO */}
      <div className="flex items-center justify-between px-4 h-[70px] border-b border-white/10" >
        {!collapsed && (
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center shrink-0">
              <span className="text-white text-sm font-bold" onClick={() => navigate("/")}>S</span>
            </div>
            <span className="text-white font-bold text-lg" onClick={() => navigate("/")}>StayNest</span>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center mx-auto">
            <span className="text-white text-sm font-bold">S</span>
          </div>
        )}
        {!collapsed && (
          <button
            onClick={() => setCollapsed(true)}
            className="text-white/40 hover:text-white transition-colors bg-transparent border-none cursor-pointer"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {collapsed && (
        <button
          onClick={() => setCollapsed(false)}
          className="text-white/40 hover:text-white transition-colors bg-transparent border-none cursor-pointer py-3 flex justify-center"
        >
          <Menu size={18} />
        </button>
      )}

      {/* USER */}
      {!collapsed && (
        <div className="px-4 py-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-brand flex items-center justify-center shrink-0">
              <span className="text-white text-sm font-bold">
                {user?.firstname?.[0]}
                {user?.lastname?.[0]}
              </span>
            </div>
            <div className="overflow-hidden">
              <p className="text-white text-sm font-semibold truncate m-0">
                {user?.firstname} {user?.lastname}
              </p>
              <p className="text-white/40 text-xs truncate m-0">
                {user?.email}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* NAV LINKS */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
        {links.map(({ label, path, icon: Icon }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl no-underline transition-all ${isActive ? "bg-brand text-white" : "text-white/60 hover:bg-white/5 hover:text-white"} ${collapsed ? "justify-center" : ""}`}
            >
              <Icon size={18} className="shrink-0" />
              {!collapsed && (
                <span className="text-sm font-medium">{label}</span>
              )}
              {!collapsed && isActive && (
                <ChevronRight size={14} className="ml-auto" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* SIGNOUT */}
      <div className="px-3 py-4 border-t border-white/10">
        <button
          onClick={handleSignOut}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/60 hover:bg-red-500/10 hover:text-red-400 transition-all bg-transparent border-none cursor-pointer ${collapsed ? "justify-center" : ""}`}
        >
          <LogOut size={18} className="shrink-0" />
          {!collapsed && <span className="text-sm font-medium">Sign Out</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
