import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import type { RootState } from "../../store";

type Props = {
  children: React.ReactNode;
  allowedRoles?: ("CUSTOMER" | "OWNER" | "SUPERADMIN")[];
};

const ProtectedRoute = ({ children, allowedRoles }: Props) => {
  const { isAuthenticated, user, isInitialized } = useSelector(
    (state: RootState) => state.auth,
  );

  // wait for getMe to finish
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-page flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
