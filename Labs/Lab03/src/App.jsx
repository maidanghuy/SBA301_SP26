import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./store/auth/AuthProvider";
import ProtectedRoute from "./routes/ProtectedRoute";

import MainLayout from "./layouts/MainLayout";

import Home from "./pages/Home/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import OrchidDetail from "./pages/OrchidDetail/OrchidDetail";
import OrchidFormPage from "./pages/OrchidFormPage";
import Login from "./pages/Auth/Login";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* PUBLIC */}
          <Route path="/login" element={<Login />} />

          {/* PROTECTED */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="orchids/:id" element={<OrchidDetail />} />
            <Route path="orchids/new" element={<OrchidFormPage />} />
            <Route path="orchids/:id/edit" element={<OrchidFormPage />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
