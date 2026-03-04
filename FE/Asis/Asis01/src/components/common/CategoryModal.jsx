import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const emptyForm = {
  categoryName: "",
  categoryDescription: "",
  parentCategoryId: "",
  isActive: true,
};

export default function CategoryModal({
  show,
  onClose,
  onSubmit,
  initialData,
  categories,
}) {
  const [formData, setFormData] = useState(
    initialData ? { ...emptyForm, ...initialData } : emptyForm,
  );

  const [validated, setValidated] = useState(false);

  const handleEnter = () => {
    setValidated(false);
    setFormData(
      initialData
        ? {
            categoryName: initialData.categoryName ?? "",
            categoryDescription: initialData.categoryDescription ?? "",
            parentCategoryId: initialData.parentCategoryId ?? "",
            isActive: initialData.isActive ?? true,
          }
        : emptyForm,
    );
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = () => {
    if (!formData.categoryName.trim()) {
      setValidated(true);
      return;
    }

    onSubmit({
      ...formData,
      categoryName: formData.categoryName.trim(),
    });
  };

  const isNameInvalid = validated && !formData.categoryName.trim();
  return (
    <Modal show={show} onHide={onClose} onEnter={handleEnter} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>
          {initialData ? "Edit Category" : "Create Category"}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form noValidate validated={validated}>
          {/* CATEGORY NAME (REQUIRED) */}
          <Form.Group className="mb-3">
            <Form.Label>
              Category Name <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              name="categoryName"
              value={formData.categoryName}
              onChange={handleChange}
              isInvalid={isNameInvalid}
              required
            />
            <Form.Control.Feedback type="invalid">
              Category name is required
            </Form.Control.Feedback>
          </Form.Group>

          {/* DESCRIPTION */}
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="categoryDescription"
              value={formData.categoryDescription}
              onChange={handleChange}
            />
          </Form.Group>

          {/* PARENT CATEGORY */}
          <Form.Group className="mb-3">
            <Form.Label>Parent Category</Form.Label>
            <Form.Select
              name="parentCategoryId"
              value={formData.parentCategoryId}
              onChange={handleChange}
            >
              <option value="">None</option>
              {categories
                .filter(
                  (c) =>
                    !initialData || c.categoryId !== initialData.categoryId,
                )
                .map((c) => (
                  <option key={c.categoryId} value={c.categoryId}>
                    {c.categoryName}
                  </option>
                ))}
            </Form.Select>
          </Form.Group>

          {/* ACTIVE */}
          <Form.Check
            type="checkbox"
            label="Active"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
          />
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>

        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={!formData.categoryName.trim()}
        >
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
