import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import useAuth from "../../hooks/useAuth";
import { Navbar, Nav, Container, NavDropdown, Button } from "react-bootstrap";
import LoginModal from "./LoginModal";

export default function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const nav = useNavigate();
  const [showLogin, setShowLogin] = useState(false);

  const onLogout = () => {
    logout();
    nav("/");
  };

  const openLogin = () => setShowLogin(true);
  const closeLogin = () => setShowLogin(false);

  return (
    <>
      <LoginModal show={showLogin} onHide={closeLogin} />

      <Navbar bg="light" expand="lg" className="shadow-sm">
        <Container>
          <Navbar.Brand as={Link} to="/">
            DE180293 - Mai Dang Huy PE Spring 25
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="main-nav" />
          <Navbar.Collapse id="main-nav">
            <Nav className="me-auto">
              <Nav.Link as={NavLink} to="/">
                Home
              </Nav.Link>
              <NavDropdown title="Car Management" id="cars-dropdown">
                <NavDropdown.Item as={NavLink} to="/cars">
                  List all cars
                </NavDropdown.Item>
                {isAuthenticated &&
                  (user?.role === "ADMIN" || user?.role === "STAFF") && (
                    <NavDropdown.Item as={NavLink} to="/cars/new">
                      Create a new car
                    </NavDropdown.Item>
                  )}
              </NavDropdown>
            </Nav>
            <Nav className="ms-auto">
              {!isAuthenticated ? (
                <Nav.Link onClick={openLogin}>Login</Nav.Link>
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
    </>
  );
}
