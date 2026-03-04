import { Outlet } from "react-router-dom";
import AdminMenu from "../components/common/AdminMenu";
import { Container, Row, Col } from "react-bootstrap";

export default function AdminLayout() {
  return (
    <Container fluid className="p-0">
      <Row className="g-0">
        <Col md={2} className="bg-light">
          <AdminMenu />
        </Col>
        <Col md={10} className="p-4">
          <Outlet />
        </Col>
      </Row>
    </Container>
  );
}
