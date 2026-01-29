import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import useAuth from "../context/useAuth";

function Header() {
  const { user, logout } = useAuth();

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const category = searchParams.get("category") || "All";
  const sort = searchParams.get("sort") || "name-asc";
  const qFromUrl = searchParams.get("q") || "";

  const [inputValue, setInputValue] = useState(qFromUrl);

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/");
    setSearchParams({ category, sort, q: inputValue });
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
      <Container fluid>
        <Navbar.Brand as={Link} to="/">
          Lab02 React App
        </Navbar.Brand>

        <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/about">
              About
            </Nav.Link>
            <Nav.Link as={Link} to="/contact">
              Contact
            </Nav.Link>
          </Nav>

          {/* 🔍 SEARCH chỉ hiện khi đã login */}
          {user && (
            <Form className="d-flex me-3" onSubmit={handleSubmit}>
              <Form.Control
                type="search"
                placeholder="Search orchid..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
            </Form>
          )}

          <Nav>
            {!user ? (
              <Nav.Link as={Link} to="/login">
                Login
              </Nav.Link>
            ) : (
              <>
                <Navbar.Text className="me-3">👋 {user.username}</Navbar.Text>
                <Button variant="outline-light" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
