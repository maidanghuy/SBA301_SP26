import { Link } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";

export default function NotFound() {
  return (
    <Container className="text-center py-5">
      <Row>
        <Col>
          <h1 className="display-4">404</h1>
          <p className="lead">Page not found.</p>
          <Button as={Link} to="/" variant="primary">
            Go Home
          </Button>
        </Col>
      </Row>
    </Container>
  );
}
