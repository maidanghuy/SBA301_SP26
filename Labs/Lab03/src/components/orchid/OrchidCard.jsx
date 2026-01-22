import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";
import { useNavigate } from "react-router-dom";

function Orchid({ orchid, categoryMap = {} }) {
  const navigate = useNavigate();

  return (
    <Card className="h-100 shadow-sm">
      <Card.Img
        variant="top"
        src={orchid.image}
        alt={orchid.orchidName}
        style={{ height: "200px", objectFit: "cover" }}
      />

      <Card.Body className="d-flex flex-column">
        <Card.Title className="d-flex justify-content-between">
          {orchid.orchidName}
          {orchid.isSpecial && <Badge bg="danger">Special</Badge>}
        </Card.Title>

        <Card.Subtitle className="mb-2 text-muted">
          Category: {categoryMap[orchid.categoryId] || "Unknown"}
        </Card.Subtitle>

        <Card.Text className="flex-grow-1">
          {orchid.description?.substring(0, 80)}...
        </Card.Text>

        <Button onClick={() => navigate(`/orchids/${orchid.id}`)}>
          View Detail
        </Button>
      </Card.Body>
    </Card>
  );
}

export default Orchid;
