import { useMemo, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import Select from "react-select";

const emptyForm = {
  newsTitle: "",
  headline: "",
  newsContent: "",
  categoryId: "",
  newsStatus: "DRAFT",
  tagIds: [],
};

export default function NewsModal({
  show,
  onClose,
  onSubmit,
  initialData,
  categories,
  tags,
}) {
  const [formData, setFormData] = useState(emptyForm);
  const [validated, setValidated] = useState(false);

  const tagOptions = useMemo(() => {
    return (tags || []).map((t) => ({
      value: t.tagId,
      label: t.tagName,
    }));
  }, [tags]);

  const selectedTagOptions = useMemo(() => {
    const selectedSet = new Set(formData.tagIds || []);
    return tagOptions.filter((opt) => selectedSet.has(opt.value));
  }, [formData.tagIds, tagOptions]);

  const handleEnter = () => {
    setValidated(false);
    setFormData(
      initialData
        ? {
            newsTitle: initialData.newsTitle ?? "",
            headline: initialData.headline ?? "",
            newsContent: initialData.newsContent ?? "",
            categoryId: initialData.categoryId ?? "",
            newsStatus: initialData.newsStatus ?? "DRAFT",
            tagIds: initialData?.tags?.map((t) => t.tagId) ?? [],
          }
        : emptyForm,
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    if (!formData.newsTitle.trim()) {
      setValidated(true);
      return;
    }
    if (!formData.categoryId) {
      setValidated(true);
      return;
    }

    const payload = {
      ...formData,
      newsTitle: formData.newsTitle.trim(),
      categoryId: Number(formData.categoryId),
      tagIds: (formData.tagIds || []).map(Number),
    };

    onSubmit(payload);
  };

  return (
    <Modal show={show} onHide={onClose} onEnter={handleEnter} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>{initialData ? "Edit News" : "Create News"}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form noValidate validated={validated}>
          <Form.Group className="mb-3">
            <Form.Label>
              Title <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              name="newsTitle"
              value={formData.newsTitle}
              onChange={handleChange}
              isInvalid={validated && !formData.newsTitle.trim()}
            />
            <Form.Control.Feedback type="invalid">
              Title is required
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Headline</Form.Label>
            <Form.Control
              name="headline"
              value={formData.headline}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Content</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              name="newsContent"
              value={formData.newsContent}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              Category <span className="text-danger">*</span>
            </Form.Label>
            <Form.Select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              isInvalid={validated && !formData.categoryId}
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c.categoryId} value={c.categoryId}>
                  {c.categoryName}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              Category is required
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Status</Form.Label>
            <Form.Select
              name="newsStatus"
              value={formData.newsStatus}
              onChange={handleChange}
            >
              <option value="DRAFT">DRAFT</option>
              <option value="PUBLISHED">PUBLISHED</option>
            </Form.Select>
          </Form.Group>

          {/* ✅ TAGS (react-select multi) */}
          <Form.Group className="mb-3">
            <Form.Label>Tags</Form.Label>

            <Select
              isMulti
              options={tagOptions}
              value={selectedTagOptions}
              placeholder="Select tags..."
              closeMenuOnSelect={false}
              onChange={(selected) => {
                const ids = (selected || []).map((opt) => opt.value);
                setFormData({ ...formData, tagIds: ids });
              }}
            />
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={!formData.newsTitle.trim()}
        >
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
