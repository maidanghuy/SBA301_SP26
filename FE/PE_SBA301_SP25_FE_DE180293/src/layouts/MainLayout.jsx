import { Outlet } from "react-router-dom";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import { Container } from "react-bootstrap";

export default function MainLayout() {
  return (
    <div>
      <Header />
      <Container as="main" className="py-4">
        <Outlet />
      </Container>
      <Footer />
    </div>
  );
}
