import Card from "react-bootstrap/Card";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";

function Orchid({ orchid }) {
  return (
    <Card className="h-100 shadow-sm">
      <Card.Img
        variant="top"
        src={`/${orchid.image}`}
        alt={orchid.orchidName}
        style={{ height: "200px", objectFit: "cover" }}
      />

      <Card.Body>
        <Card.Title className="d-flex justify-content-between align-items-center">
          {orchid.orchidName}
          {orchid.isSpecial && <Badge bg="danger">Special</Badge>}
        </Card.Title>

        <Card.Subtitle className="mb-2 text-muted">
          Category: {orchid.category}
        </Card.Subtitle>

        <Card.Text style={{ fontSize: "0.9rem" }}>
          {orchid.description}
        </Card.Text>
        <Button variant="primary">View Detail</Button>
      </Card.Body>
    </Card>
  );
}

export default Orchid;
