import { useMemo, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const emptyForm = {
  accountName: "",
  accountEmail: "",
  accountRole: "USER",
  accountPassword: "",
};

export default function UserModal({ show, onClose, onSubmit, initialData }) {
  const [formData, setFormData] = useState(emptyForm);
  const [validated, setValidated] = useState(false);

  const isEdit = useMemo(() => !!initialData?.accountId, [initialData]);

  const handleEnter = () => {
    setValidated(false);
    setFormData(
      isEdit
        ? {
            accountName: initialData.accountName ?? "",
            accountEmail: initialData.accountEmail ?? "",
            accountRole: initialData.accountRole ?? "USER",
            accountPassword: "",
          }
        : emptyForm,
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    const nameOk = formData.accountName.trim();
    const emailOk = formData.accountEmail.trim();
    const passOk = formData.accountPassword.trim();

    if (!nameOk || (!isEdit && (!emailOk || !passOk))) {
      setValidated(true);
      return;
    }

    const payload = {
      accountName: formData.accountName.trim(),
      accountRole: formData.accountRole,
    };

    if (!isEdit) {
      payload.accountEmail = formData.accountEmail.trim();
      payload.accountPassword = formData.accountPassword;
    } else {
      // update: password optional
      if (formData.accountPassword.trim()) {
        payload.accountPassword = formData.accountPassword;
      }
    }

    onSubmit(payload);
  };

  return (
    <Modal show={show} onHide={onClose} onEnter={handleEnter} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>{isEdit ? "Edit User" : "Create User"}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form noValidate validated={validated}>
          <Form.Group className="mb-3">
            <Form.Label>
              Name <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              name="accountName"
              value={formData.accountName}
              onChange={handleChange}
              isInvalid={validated && !formData.accountName.trim()}
            />
            <Form.Control.Feedback type="invalid">
              Name is required
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              Email {!isEdit && <span className="text-danger">*</span>}
            </Form.Label>
            <Form.Control
              name="accountEmail"
              value={formData.accountEmail}
              onChange={handleChange}
              disabled={isEdit} // email không sửa
              isInvalid={validated && !isEdit && !formData.accountEmail.trim()}
            />
            <Form.Control.Feedback type="invalid">
              Email is required
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              Password {!isEdit && <span className="text-danger">*</span>}
            </Form.Label>
            <Form.Control
              type="password"
              name="accountPassword"
              value={formData.accountPassword}
              onChange={handleChange}
              placeholder={isEdit ? "Leave blank to keep current password" : ""}
              isInvalid={
                validated && !isEdit && !formData.accountPassword.trim()
              }
            />
            <Form.Control.Feedback type="invalid">
              Password is required
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group>
            <Form.Label>Role</Form.Label>
            <Form.Select
              name="accountRole"
              value={formData.accountRole}
              onChange={handleChange}
            >
              <option value="ADMIN">ADMIN</option>
              <option value="EDITOR">EDITOR</option>
              <option value="USER">USER</option>
            </Form.Select>
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
