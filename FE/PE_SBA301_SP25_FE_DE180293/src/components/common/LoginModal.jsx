import { Modal, Button } from "react-bootstrap";
import PropTypes from "prop-types";
import Login from "../../pages/Auth/Login";

// The Login page accepts an optional onSuccess prop to close the modal
export default function LoginModal({ show, onHide }) {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Login to Cars Management System</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Login onSuccess={onHide} />
      </Modal.Body>
    </Modal>
  );
}

LoginModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
};
