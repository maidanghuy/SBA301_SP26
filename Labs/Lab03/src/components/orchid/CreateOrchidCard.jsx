import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";

function CreateOrchidCard() {
  const navigate = useNavigate();

  return (
    <Card
      className="h-100 border-2 border-dashed shadow-sm d-flex align-items-center justify-content-center text-center"
      style={{
        borderStyle: "dashed",
        cursor: "pointer",
        transition: "0.2s",
      }}
      onClick={() => navigate("/orchids/new")}
    >
      <Card.Body className="d-flex flex-column align-items-center justify-content-center">
        <div
          className="rounded-circle bg-light d-flex align-items-center justify-content-center mb-3"
          style={{ width: 64, height: 64, fontSize: 32 }}
        >
          ➕
        </div>

        <Card.Title className="fw-bold">Create Orchid</Card.Title>
        <Card.Text className="text-muted small">
          Add a new orchid to the collection
        </Card.Text>

        <Button variant="outline-success" size="sm">
          Create
        </Button>
      </Card.Body>
    </Card>
  );
}

export default CreateOrchidCard;
