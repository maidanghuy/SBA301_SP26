import { Container, Card } from "react-bootstrap";

export default function Dashboard() {
  return (
    <Container className="py-4">
      <Card className="p-4">
        <Card.Title>Admin Dashboard</Card.Title>
        <Card.Text>Manage rooms, customers, bookings.</Card.Text>
      </Card>
    </Container>
  );
}
