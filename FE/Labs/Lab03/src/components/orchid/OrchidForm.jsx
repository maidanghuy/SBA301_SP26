import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Spinner from "react-bootstrap/Spinner";
import { useState } from "react";

function OrchidForm({ initialData, categories, onSubmit, loading }) {
  const [imagePreview, setImagePreview] = useState(initialData?.image || "");

  return (
    <Card className="shadow-sm border-0">
      <Card.Body>
        <Card.Title className="mb-4 fw-bold fs-4">
          🌸 Orchid Information
        </Card.Title>

        <Form onSubmit={onSubmit}>
          <Row>
            {/* LEFT */}
            <Col md={8}>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  name="orchidName"
                  defaultValue={initialData?.orchidName || ""}
                  placeholder="Enter orchid name"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  name="description"
                  placeholder="Describe this orchid..."
                  defaultValue={initialData?.description || ""}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Select
                  name="categoryId"
                  defaultValue={initialData?.categoryId || ""}
                  required
                >
                  <option value="">-- Select category --</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Check
                type="checkbox"
                label="🌟 Special Orchid"
                name="isSpecial"
                defaultChecked={initialData?.isSpecial || false}
                className="mb-3"
              />
            </Col>

            {/* RIGHT */}
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Image URL</Form.Label>
                <Form.Control
                  name="image"
                  placeholder="https://..."
                  defaultValue={initialData?.image || ""}
                  onChange={(e) => setImagePreview(e.target.value)}
                />
              </Form.Group>

              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="img-fluid rounded shadow-sm"
                  style={{ maxHeight: 220, objectFit: "cover" }}
                />
              )}
            </Col>
          </Row>

          <div className="d-flex justify-content-end mt-4">
            <Button type="submit" disabled={loading}>
              {loading && (
                <Spinner size="sm" animation="border" className="me-2" />
              )}
              {loading ? "Saving..." : "Save Orchid"}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default OrchidForm;
