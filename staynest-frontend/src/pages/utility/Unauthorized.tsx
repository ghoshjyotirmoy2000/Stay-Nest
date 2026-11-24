import { useNavigate } from "react-router-dom";
import { ShieldX, ArrowLeft, Home } from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";

const Unauthorized = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <div className="min-h-screen bg-page font-sans flex items-center justify-center px-[5%]">
      <div className="text-center max-w-[480px]">

        {/* ICON */}
        <div className="relative mb-8">
          <p className="text-[160px] font-extrabold text-neutral-100 leading-none tracking-tight select-none">403</p>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 bg-red-500 rounded-2xl flex items-center justify-center">
              <ShieldX size={36} className="text-white" />
            </div>
          </div>
        </div>

        <h1 className="text-2xl font-extrabold text-brand-dark mb-3 tracking-tight">Access Denied</h1>
        <p className="text-neutral-400 text-sm leading-relaxed mb-3 max-w-[340px] mx-auto">
          You don't have permission to access this page.
          {user && (
            <span> Your current role is <span className="font-semibold text-brand">{user.role}</span>.</span>
          )}
        </p>

        {/* ROLE HINT */}
        <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-8 text-left">
          <p className="text-red-600 text-xs font-semibold m-0">
            {user?.role === "CUSTOMER"
              ? "This page is only accessible to Hotel Owners. Register as an Owner to access this page."
              : user?.role === "OWNER"
              ? "This page is only accessible to Customers."
              : "Please sign in to access this page."}
          </p>
        </div>

        <div className="flex items-center justify-center gap-3">
          <button onClick={() => navigate(-1)}
            className="flex items-center gap-2 bg-white border border-neutral-200 text-brand-dark px-5 py-2.5 rounded-xl text-sm font-bold cursor-pointer hover:bg-neutral-50 transition-colors">
            <ArrowLeft size={15} /> Go Back
          </button>
          <button onClick={() => navigate("/")}
            className="flex items-center gap-2 bg-brand-dark text-white border-none px-5 py-2.5 rounded-xl text-sm font-bold cursor-pointer hover:bg-brand transition-colors">
            <Home size={15} /> Go Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;