import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

function ContactResultModal({ show, onClose, data }) {
  if (!data) return null;

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Submitted Information</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p>
          <strong>Name:</strong> {data.name}
        </p>
        <p>
          <strong>Email:</strong> {data.email}
        </p>
        <p>
          <strong>Message:</strong>
          <br />
          {data.message}
        </p>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ContactResultModal;
