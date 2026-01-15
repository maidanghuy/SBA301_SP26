import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Form from "react-bootstrap/Form";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useState } from "react";

function Header() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const category = searchParams.get("category") || "All";
  const sort = searchParams.get("sort") || "name-asc";
  const qFromUrl = searchParams.get("q") || "";

  const [inputValue, setInputValue] = useState(qFromUrl);

  const handleSubmit = (e) => {
    e.preventDefault();

    navigate("/");

    setSearchParams({
      category,
      sort,
      q: inputValue,
    });
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container fluid>
        <Navbar.Brand as={Link} to="/">
          Lab02 React App
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/about">
              About
            </Nav.Link>
            <Nav.Link as={Link} to="/blog">
              Blog
            </Nav.Link>
            <Nav.Link as={Link} to="/contact">
              Contact
            </Nav.Link>
          </Nav>

          {/* 🔍 SEARCH */}
          <Form className="d-flex me-3" onSubmit={handleSubmit}>
            <Form.Control
              type="search"
              placeholder="Search orchid..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </Form>

          <Nav>
            <Nav.Link as={Link} to="/login">
              Login
            </Nav.Link>
            <Nav.Link as={Link} to="/register">
              Register
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
