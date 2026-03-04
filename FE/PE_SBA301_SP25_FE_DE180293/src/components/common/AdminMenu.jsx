import { NavLink } from "react-router-dom";
import { Nav } from "react-bootstrap";

export default function AdminMenu() {
  return (
    <Nav className="flex-column p-3" style={{ minHeight: "100vh" }}>
      <div className="h5 mb-3">Admin</div>
      <Nav.Link as={NavLink} to="/admin">
        Dashboard
      </Nav.Link>
      <Nav.Link as={NavLink} to="/admin/rooms">
        Rooms
      </Nav.Link>
      <Nav.Link as={NavLink} to="/admin/customers">
        Customers
      </Nav.Link>
      <Nav.Link as={NavLink} to="/admin/bookings">
        Bookings
      </Nav.Link>
    </Nav>
  );
}
