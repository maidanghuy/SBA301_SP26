import { useParams, Link, Navigate } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";

import orchids from "../data/orchids";
import categories from "../data/categories";

function OrchidDetail() {
  const { id } = useParams();

  const orchid = orchids.find((o) => o.id === id);

  const categoryMap = Object.fromEntries(categories.map((c) => [c.id, c.name]));

  if (!orchid) {
    return <Navigate to="/404" replace />;
  }

  return (
    <>
      <Button as={Link} to="/" className="mb-3">
        ← Back to Home
      </Button>

      <Card className="shadow">
        <Card.Img
          variant="top"
          src={`/${orchid.image}`}
          style={{ maxHeight: "600px", objectFit: "cover" }}
        />

        <Card.Body>
          <Card.Title className="d-flex justify-content-between">
            {orchid.orchidName}
            {orchid.isSpecial && <Badge bg="danger">Special</Badge>}
          </Card.Title>

          <Card.Subtitle className="mb-3 text-muted">
            Category: {categoryMap[orchid.categoryId]}
          </Card.Subtitle>

          <Card.Text>{orchid.description}</Card.Text>
        </Card.Body>
      </Card>
    </>
  );
}

export default OrchidDetail;
