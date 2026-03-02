import { Link } from "react-router-dom";
import { Container, Row, Col, Card, Button } from "react-bootstrap";

export default function Home() {
  return (
    <Container className="text-center py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>Welcome to FUMiniHotel</Card.Title>
              <Card.Text>
                Browse rooms publicly, or login to book. We provide modern
                amenities and easy reservation management.
              </Card.Text>
              <Button as={Link} to="/rooms" variant="primary">
                View Rooms
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
