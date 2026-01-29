import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import BannerCarousel from "../components/banner/BannerCarousel";
import { Outlet } from "react-router-dom";

function MainLayout() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />

      <BannerCarousel />

      <main className="flex-fill container py-4">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

export default MainLayout;
