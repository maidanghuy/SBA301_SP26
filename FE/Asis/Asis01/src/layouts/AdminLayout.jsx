import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import AdminMenu from "../components/common/AdminMenu";
import { Outlet } from "react-router-dom";
import { Container } from "react-bootstrap";
import { useState } from "react";

const SIDEBAR_W = 240;
const HEADER_H = 56;

export default function AdminLayout() {
  const [showSidebar, setShowSidebar] = useState(true);

  const contentOffset = showSidebar ? SIDEBAR_W : 0;

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Nếu Header của bạn chưa fixed-top thì nên fixed để layout ổn định */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: HEADER_H,
          zIndex: 1030, // cao hơn sidebar
        }}
      >
        {/* Nếu bạn muốn toggle sidebar từ header:
            truyền prop setShowSidebar vào Header, ví dụ:
            <Header onToggle={() => setShowSidebar(!showSidebar)} />
        */}
        <Header />
      </div>

      {/* SIDEBAR */}
      {showSidebar && (
        <div
          className="bg-dark text-light"
          style={{
            position: "fixed",
            top: HEADER_H,
            left: 0,
            width: SIDEBAR_W,
            height: `calc(100vh - ${HEADER_H}px)`,
            overflowY: "auto",
            zIndex: 1020,
          }}
        >
          <div className="p-2">
            <AdminMenu />
          </div>
        </div>
      )}

      {/* MAIN CONTENT */}
      <div
        style={{
          marginLeft: contentOffset,
          paddingTop: HEADER_H + 16,
          transition: "margin-left 0.2s ease",
          flex: 1,
        }}
      >
        <Container fluid className="pb-3">
          <div className="bg-light border p-3">
            {/* Nút toggle nhanh nếu bạn chưa có trong Header */}
            <div className="d-flex justify-content-end mb-3">
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={() => setShowSidebar((prev) => !prev)}
              >
                {showSidebar ? "Hide menu" : "Show menu"}
              </button>
            </div>

            <Outlet />
          </div>
        </Container>
      </div>

      {/* FOOTER */}
      <div
        style={{
          marginLeft: contentOffset,
          transition: "margin-left 0.2s ease",
        }}
      >
        <Footer />
      </div>
    </div>
  );
}
