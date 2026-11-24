import { useNavigate } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-page font-sans flex items-center justify-center px-[5%]">
      <div className="text-center max-w-[480px]">

        {/* 404 */}
        <div className="relative mb-8">
          <p className="text-[160px] font-extrabold text-neutral-100 leading-none tracking-tight select-none">404</p>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 bg-brand rounded-2xl flex items-center justify-center">
              <span className="text-white text-3xl font-extrabold">S</span>
            </div>
          </div>
        </div>

        <h1 className="text-2xl font-extrabold text-brand-dark mb-3 tracking-tight">Page not found</h1>
        <p className="text-neutral-400 text-sm leading-relaxed mb-8 max-w-[320px] mx-auto">
          Looks like this page checked out. The page you're looking for doesn't exist or has been moved.
        </p>

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

export default NotFound;