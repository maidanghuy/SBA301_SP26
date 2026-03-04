import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <Container className="py-5">
      <Row>
        <Col className="text-center">
          <h1>Welcome to Car Management System</h1>
          <p className="lead">
            Use the navigation bar to browse or manage car records.
          </p>
          <Link to="/cars">
            <Button variant="primary">View Cars</Button>
          </Link>
        </Col>
      </Row>
    </Container>
  );
}
