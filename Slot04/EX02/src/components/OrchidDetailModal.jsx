import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";

function OrchidDetailModal({ show, handleClose, orchid }) {
  if (!orchid) return null;

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          {orchid.orchidName}{" "}
          {orchid.isSpecial && <Badge bg="danger">Special</Badge>}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <img
          src={`/${orchid.image}`}
          alt={orchid.orchidName}
          className="img-fluid rounded mb-3"
        />

        <p>
          <strong>Category:</strong> {orchid.category}
        </p>

        <p>{orchid.description}</p>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default OrchidDetailModal;
