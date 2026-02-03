import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AuthProvider } from "./store/auth/AuthProvider";
import ProtectedRoute from "./routes/ProtectedRoute";
import RoleRoute from "./routes/RoleRoute";

import Login from "./pages/Auth/Login";
// import Unauthorized from "./pages/Unauthorized";

import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Category from "./pages/admin/Category";
import News from "./pages/admin/News";
import Users from "./pages/admin/Users";
import Settings from "./pages/admin/Settings";

function App() {
  return (
    <BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        newestOnTop
        closeOnClick
        pauseOnHover
      />
      <AuthProvider>
        <Routes>
          {/* PUBLIC */}
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Login />} />
          {/* <Route path="/unauthorized" element={<Unauthorized />} /> */}

          {/* ADMIN AREA (protected) */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            {/* Dashboard: ADMIN/STAFF/MEMBER */}
            <Route
              path="dashboard"
              element={
                <RoleRoute allowedRoles={["ADMIN", "STAFF"]}>
                  <Dashboard />
                </RoleRoute>
              }
            />

            {/* Category + News: ADMIN/STAFF */}
            <Route
              path="category"
              element={
                <RoleRoute allowedRoles={["ADMIN", "STAFF"]}>
                  <Category />
                </RoleRoute>
              }
            />
            <Route
              path="news"
              element={
                <RoleRoute allowedRoles={["ADMIN", "STAFF"]}>
                  <News />
                </RoleRoute>
              }
            />

            {/* Users + Settings: ADMIN only */}
            <Route
              path="users"
              element={
                <RoleRoute allowedRoles={["ADMIN"]}>
                  <Users />
                </RoleRoute>
              }
            />
            <Route
              path="settings"
              element={
                <RoleRoute allowedRoles={["ADMIN"]}>
                  <Settings />
                </RoleRoute>
              }
            />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
