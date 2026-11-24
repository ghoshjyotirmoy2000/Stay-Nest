import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider, useDispatch } from "react-redux";
import { store, type AppDispatch } from "./store";
import ProtectedRoute from "./components/common/ProtectedRoutes";

// auth
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// public
import Landing from "./pages/public/LandingPage";
import Hotels from "./pages/public/Hotels";
import HotelDetail from "./pages/public/HotelDetail";

// customer
import Booking from "./pages/customer/Booking";
import MyBookings from "./pages/customer/MyBookings";
import Profile from "./pages/customer/Profile";
import MyReviews from "./pages/customer/MyReviews";

// owner
import MyHotels from "./pages/owner/MyHotels";
import CreateHotel from "./pages/owner/CreateHotel";
import EditHotel from "./pages/owner/EditHotel";
import ManageRooms from "./pages/owner/ManageRooms";
import Analytics from "./pages/owner/Analytics";

// admin
import HotelAdmins from "./pages/admin/HotelAdmins";
import AllUsers from "./pages/admin/AllUsers";

// utility
import NotFound from "./pages/utility/NotFound";
import Unauthorized from "./pages/utility/Unauthorized";
import AppInitializer from "./components/common/AppInitializer";

const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppInitializer>
          <Routes>
            {/* public routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/hotels" element={<Hotels />} />
            <Route path="/hotels/:id" element={<HotelDetail />} />

            {/* auth routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* customer routes */}
            <Route path="/booking/:roomId" element={
              <ProtectedRoute allowedRoles={["CUSTOMER"]}>
                <Booking />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/bookings" element={
              <ProtectedRoute allowedRoles={["CUSTOMER"]}>
                <MyBookings />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/reviews" element={
              <ProtectedRoute allowedRoles={["CUSTOMER"]}>
                <MyReviews />
              </ProtectedRoute>
            } />

            {/* owner routes */}
            <Route path="/dashboard/hotels" element={
              <ProtectedRoute allowedRoles={["OWNER"]}>
                <MyHotels />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/hotels/create" element={
              <ProtectedRoute allowedRoles={["OWNER"]}>
                <CreateHotel />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/hotels/:id/edit" element={
              <ProtectedRoute allowedRoles={["OWNER"]}>
                <EditHotel />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/hotels/:id/rooms" element={
              <ProtectedRoute allowedRoles={["OWNER"]}>
                <ManageRooms />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/analytics" element={
              <ProtectedRoute allowedRoles={["OWNER"]}>
                <Analytics />
              </ProtectedRoute>
            } />

            {/* superadmin routes */}
            <Route path="/dashboard/admin/hotel-admins" element={
              <ProtectedRoute allowedRoles={["SUPERADMIN"]}>
                <HotelAdmins />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/admin/users" element={
              <ProtectedRoute allowedRoles={["SUPERADMIN"]}>
                <AllUsers />
              </ProtectedRoute>
            } />

            {/* utility */}
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppInitializer>
      </BrowserRouter>
    </Provider>
  );
};

export default App;
