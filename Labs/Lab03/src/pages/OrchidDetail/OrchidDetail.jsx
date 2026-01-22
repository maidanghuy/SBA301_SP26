import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";
import Stack from "react-bootstrap/Stack";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import { orchidService } from "../../api/orchidService";
import { categoryService } from "../../api/categoryService";

function OrchidDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

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
      {/* Action Bar */}
      <Stack direction="horizontal" gap={2} className="mb-4">
        <Button as={Link} to="/" variant="outline-secondary">
          ← Back
        </Button>

        <Button
          variant="warning"
          onClick={() => navigate(`/orchids/${orchid.id}/edit`)}
        >
          Edit
        </Button>

        <Button
          variant="danger"
          onClick={async () => {
            if (window.confirm("Delete this orchid?")) {
              await orchidService.delete(orchid.id);
              navigate("/");
            }
          }}
        >
          Delete
        </Button>
      </Stack>

      <Card className="shadow-lg border-0">
        <Row className="g-0">
          {/* Image */}
          <Col md={5}>
            <Card.Img
              src={orchid.image}
              alt={orchid.orchidName}
              style={{
                height: "100%",
                objectFit: "cover",
                borderTopLeftRadius: "0.5rem",
                borderBottomLeftRadius: "0.5rem",
              }}
            />
          </Col>

          {/* Content */}
          <Col md={7}>
            <Card.Body>
              <Card.Title className="d-flex align-items-center gap-2">
                <span className="fs-4 fw-bold">{orchid.orchidName}</span>
                {orchid.isSpecial && <Badge bg="danger">Special</Badge>}
              </Card.Title>

              <Card.Subtitle className="mb-3 text-muted">
                🌸 Category: {categoryMap[orchid.categoryId] || "Unknown"}
              </Card.Subtitle>

              <Card.Text style={{ lineHeight: 1.7 }}>
                {orchid.description}
              </Card.Text>
            </Card.Body>
          </Col>
        </Row>
      </Card>
    </>
  );
}

export default OrchidDetail;
