import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Mail, Phone, Users } from "lucide-react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { getAllUsers } from "../../store/slices/adminSlice";
import type { AppDispatch, RootState } from "../../store";

const ROLE_STYLES: Record<string, string> = {
  SUPERADMIN: "bg-purple-100 text-purple-600",
  OWNER: "bg-brand/10 text-brand",
  CUSTOMER: "bg-neutral-100 text-neutral-500",
};

const AllUsers = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { allUsers, isLoading, error } = useSelector((state: RootState) => state.admin);

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  return (
    <DashboardLayout>
      <div className="p-8">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-brand-dark tracking-tight m-0">All Users</h1>
            <p className="text-neutral-400 text-sm mt-1 m-0">Every account registered on StayNest</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-6">
            <p className="text-red-600 text-sm m-0">{error}</p>
          </div>
        )}

        {/* STATS */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Total Users", value: allUsers.length },
            { label: "Hotel Admins", value: allUsers.filter(u => u.role === "OWNER").length },
            { label: "Customers", value: allUsers.filter(u => u.role === "CUSTOMER").length },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-2xl p-5 border border-neutral-100">
              <p className="text-neutral-400 text-xs font-semibold uppercase tracking-wider m-0 mb-2">{stat.label}</p>
              <p className="text-3xl font-extrabold text-brand-dark m-0">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* LOADING */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* EMPTY */}
        {!isLoading && allUsers.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-brand/10 rounded-2xl flex items-center justify-center mb-4">
              <Users size={32} className="text-brand" />
            </div>
            <h3 className="text-lg font-bold text-brand-dark mb-2">No users yet</h3>
          </div>
        )}

        {/* TABLE */}
        {!isLoading && allUsers.length > 0 && (
          <div className="bg-white rounded-2xl border border-neutral-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-neutral-100">
              <h2 className="text-sm font-bold text-brand-dark m-0">{allUsers.length} Users</h2>
            </div>

            <div className="divide-y divide-neutral-100">
              {allUsers.map(u => (
                <div key={u.id} className="flex items-center gap-4 px-6 py-4 hover:bg-neutral-50 transition-colors">

                  <div className="w-11 h-11 rounded-full bg-brand/10 flex items-center justify-center shrink-0">
                    <span className="text-brand text-sm font-bold">
                      {u.firstname?.[0]}{u.lastname?.[0]}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-brand-dark text-sm m-0 mb-1">
                      {u.firstname} {u.lastname}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-neutral-400">
                      <span className="flex items-center gap-1"><Mail size={11} /> {u.email}</span>
                      <span className="flex items-center gap-1"><Phone size={11} /> {u.phone}</span>
                    </div>
                  </div>

                  <div className={`px-3 py-1.5 rounded-full text-xs font-bold shrink-0 capitalize ${ROLE_STYLES[u.role] || "bg-neutral-100 text-neutral-500"}`}>
                    {u.role.toLowerCase()}
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

export default AllUsers;
