import { useParams, Link, Navigate } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";

import { useEffect, useState } from "react";
import { orchidService } from "../../api/orchidService";
import { categoryService } from "../../api/categoryService";

function OrchidDetail() {
  const { id } = useParams();

  const [orchid, setOrchid] = useState(null);
  const [categoryMap, setCategoryMap] = useState({});

  useEffect(() => {
    orchidService.getById(id).then((res) => setOrchid(res.data));
    categoryService
      .getAll()
      .then((res) =>
        setCategoryMap(Object.fromEntries(res.data.map((c) => [c.id, c.name]))),
      );
  }, [id]);

  if (!orchid) return null;

  return (
    <>
      <Button as={Link} to="/" className="mb-3">
        ← Back to Home
      </Button>

      <Card className="shadow">
        <Card.Img variant="top" src={orchid.image} />

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
