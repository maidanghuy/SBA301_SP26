import { useState } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";

function Orchid({ orchid }) {
  const [setShowModal] = useState(false);

  return (
    <>
      <Card className="h-100 shadow-sm">
        <Card.Img
          variant="top"
          src={`/${orchid.image}`}
          alt={orchid.orchidName}
          style={{ height: "200px", objectFit: "cover" }}
        />

        <Card.Body className="d-flex flex-column">
          <Card.Title className="d-flex justify-content-between align-items-center">
            {orchid.orchidName}
            {orchid.isSpecial && <Badge bg="danger">Special</Badge>}
          </Card.Title>

          <Card.Subtitle className="mb-2 text-muted">
            Category: {orchid.category}
          </Card.Subtitle>

          <Card.Text className="flex-grow-1" style={{ fontSize: "0.9rem" }}>
            {orchid.description.substring(0, 80)}...
          </Card.Text>

          <Button variant="primary" onClick={() => setShowModal(true)}>
            View Detail
          </Button>
        </Card.Body>
      </Card>
    </>
  );
}

export default Orchid;
