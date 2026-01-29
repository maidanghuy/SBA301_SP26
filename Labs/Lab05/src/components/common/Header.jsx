import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth";

function Header() {
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);

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

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 80);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <Navbar
      bg="dark"
      variant="dark"
      expand="lg"
      className={scrolled ? "fixed-top shadow" : ""}
    >
      <Container fluid>
        <Navbar.Brand as={Link} to="/">
          Lab03 React App
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
                {user && (
                  <Navbar.Text className="me-3">👋 {user.name}</Navbar.Text>
                )}
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
