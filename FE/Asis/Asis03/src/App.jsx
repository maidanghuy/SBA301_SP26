import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";

import ProtectedRoute from "./routes/ProtectedRoute";
import RoleRoute from "./routes/RoleRoute";

import Home from "./pages/Home/Home";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Rooms from "./pages/Rooms/Rooms";

import Profile from "./pages/Customer/Profile";
import MyBookings from "./pages/Customer/MyBookings";
import NewBooking from "./pages/Customer/NewBooking";

import Dashboard from "./pages/admin/Dashboard";
import RoomsAdmin from "./pages/admin/RoomsAdmin";
import CustomersAdmin from "./pages/admin/CustomersAdmin";
import BookingsAdmin from "./pages/admin/BookingsAdmin";

import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/rooms" element={<Rooms />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Auth required */}
        <Route element={<ProtectedRoute />}>
          {/* CUSTOMER */}
          <Route element={<RoleRoute allow={["CUSTOMER"]} />}>
            <Route path="/me" element={<Profile />} />
            <Route path="/my-bookings" element={<MyBookings />} />
            <Route path="/booking/new" element={<NewBooking />} />
          </Route>

          {/* STAFF */}
          <Route element={<RoleRoute allow={["STAFF"]} />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="rooms" element={<RoomsAdmin />} />
              <Route path="customers" element={<CustomersAdmin />} />
              <Route path="bookings" element={<BookingsAdmin />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
