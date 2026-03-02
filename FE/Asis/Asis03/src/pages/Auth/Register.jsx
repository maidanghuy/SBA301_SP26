import { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../../api/authService";
import {
  Form,
  Button,
  Card,
  Alert,
  Container,
  Row,
  Col,
} from "react-bootstrap";

export default function Register() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
  });
  const [err, setErr] = useState("");

  const onChange = (k) => (e) =>
    setForm((p) => ({ ...p, [k]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      await authService.register(form);
      nav("/login");
    } catch (ex) {
      setErr(ex.message || "Register failed");
    }
  };

  return (
    <Container className="d-flex justify-content-center py-5">
      <Row>
        <Col>
          <Card className="p-4" style={{ minWidth: 320 }}>
            <Card.Title className="mb-3">Register</Card.Title>
            {err && <Alert variant="danger">{err}</Alert>}
            <Form onSubmit={onSubmit}>
              <Form.Group className="mb-3" controlId="regFullName">
                <Form.Label>Full name</Form.Label>
                <Form.Control
                  type="text"
                  value={form.fullName}
                  onChange={onChange("fullName")}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="regEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={form.email}
                  onChange={onChange("email")}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="regPhone">
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  type="text"
                  value={form.phone}
                  onChange={onChange("phone")}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="regPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  value={form.password}
                  onChange={onChange("password")}
                  required
                />
              </Form.Group>
              <Button variant="primary" type="submit">
                Create account
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
