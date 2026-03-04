import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";

import ProtectedRoute from "./routes/ProtectedRoute";
import RoleRoute from "./routes/RoleRoute";

import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Home from "./pages/Home";
import CarManagement from "./pages/Cars/CarManagement";

import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* open listing to everyone */}
        <Route path="/cars" element={<CarManagement />} />

        {/* Authenticated area */}
        <Route element={<ProtectedRoute />}>
          {/* ADMIN & STAFF can create/edit cars */}
          <Route element={<RoleRoute allow={["ADMIN", "STAFF"]} />}>
            <Route path="/cars/new" element={<CarManagement />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
