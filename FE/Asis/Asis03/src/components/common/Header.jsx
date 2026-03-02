import { Link, NavLink, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { Navbar, Nav, Container, NavDropdown, Button } from "react-bootstrap";

export default function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const nav = useNavigate();

  const onLogout = () => {
    logout();
    nav("/");
  };

  return (
    <Navbar bg="light" expand="lg" className="shadow-sm">
      <Container>
        <Navbar.Brand as={Link} to="/">
          FUMiniHotel
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-nav" />
        <Navbar.Collapse id="main-nav">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/rooms">
              Rooms
            </Nav.Link>
            {isAuthenticated && user?.role === "CUSTOMER" && (
              <>
                <Nav.Link as={NavLink} to="/me">
                  My Profile
                </Nav.Link>
                <Nav.Link as={NavLink} to="/my-bookings">
                  My Bookings
                </Nav.Link>
                <Nav.Link as={NavLink} to="/booking/new">
                  New Booking
                </Nav.Link>
              </>
            )}
            {isAuthenticated && user?.role === "STAFF" && (
              <Nav.Link as={NavLink} to="/admin">
                Admin
              </Nav.Link>
            )}
          </Nav>
          <Nav className="ms-auto">
            {!isAuthenticated ? (
              <Nav.Link as={NavLink} to="/login">
                Login
              </Nav.Link>
            ) : (
              <NavDropdown
                title={`${user?.email} (${user?.role})`}
                id="user-dropdown"
                align="end"
              >
                <NavDropdown.Item onClick={onLogout}>Logout</NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
