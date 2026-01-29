import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";
import Stack from "react-bootstrap/Stack";
import { useNavigate } from "react-router-dom";

function Orchid({ orchid, categoryMap = {} }) {
  const navigate = useNavigate();

  return (
    <Card className="h-100 shadow-sm border-0">
      {/* IMAGE */}
      <Card.Img
        variant="top"
        src={orchid.image}
        alt={orchid.orchidName}
        style={{ height: "200px", objectFit: "cover" }}
      />

      {/* BODY */}
      <Card.Body className="d-flex flex-column">
        {/* TITLE */}
        <Card.Title className="d-flex justify-content-between align-items-start">
          <span>{orchid.orchidName}</span>
          {orchid.isSpecial && <Badge bg="danger">Special</Badge>}
        </Card.Title>

        {/* CATEGORY */}
        <Card.Subtitle className="mb-2 text-muted">
          Category: {categoryMap[orchid.categoryId] || "Unknown"}
        </Card.Subtitle>

        {/* DESCRIPTION */}
        <Card.Text className="flex-grow-1 text-secondary small">
          {orchid.description?.substring(0, 80)}...
        </Card.Text>

        {/* ACTIONS */}
        <Stack direction="horizontal" gap={2} className="mt-auto">
          <Button
            size="sm"
            variant="outline-primary"
            className="flex-fill"
            onClick={() => navigate(`/orchids/${orchid.id}`)}
          >
            View
          </Button>

          <Button
            size="sm"
            variant="outline-warning"
            className="flex-fill"
            onClick={() => navigate(`/orchids/${orchid.id}/edit`)}
          >
            Edit
          </Button>
        </Stack>
      </Card.Body>
    </Card>
  );
}

export default Orchid;
