import { useEffect, useState, useCallback } from "react";
import { Button, Container, Row, Col, Modal } from "react-bootstrap";
import carService from "../../api/carService";
import countryService from "../../api/countryService";
import CarList from "../../components/cars/CarList";
import CarForm from "../../components/cars/CarForm";
import useAuth from "../../hooks/useAuth";

export default function CarManagement() {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN" || user?.role === "STAFF";

  const [cars, setCars] = useState([]);
  const [countries, setCountries] = useState([]);

  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(
    window.location.pathname === "/cars/new",
  );
  const [showConfirm, setShowConfirm] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  const load = useCallback(() => {
    carService.list().then((res) => {
      let list = res;
      // members should not see deleted entries (deleteFlag true or non-null)
      if (user?.role === "MEMBER") {
        list = list.filter((c) => !c.deleteFlag);
      }
      setCars(list);
    });
  }, [user]);

  useEffect(() => {
    load();
    countryService.list().then((res) => {
      setCountries(res);
    });
  }, [load]);

  const openNew = () => {
    setEditing(null);
    setShowForm(true);
  };

  const openEdit = (car) => {
    // convert response object to form initial values
    // backend response may only include countryName, so map to id via countries list
    const countryObj = countries.find((c) => {
      if (c.countryName && car.countryName) {
        if (c.countryName === car.countryName) return true;
      }
      const cid = c.countryID ?? c.countryId ?? c.id;
      return (
        cid !== undefined && (cid === car.countryID || cid === car.countryId)
      );
    });
    const cidValue = countryObj
      ? (countryObj.countryID ?? countryObj.countryId ?? countryObj.id)
      : "";

    setEditing({
      carId: car.carId,
      carName: car.carName,
      countryId: cidValue,
      unitsInStock: car.unitsInStock,
      unitPrice: car.unitPrice,
    });
    setShowForm(true);
  };

  const handleDelete = (car) => {
    setToDelete(car);
    setShowConfirm(true);
  };

  const handleRecover = (car) => {
    // call backend recover endpoint
    carService.recover(car.carId).then(() => {
      load();
    });
  };

  const confirmDelete = () => {
    carService.remove(toDelete.carId).then(() => {
      setShowConfirm(false);
      // refresh list; admin will see flagged row after deletion
      load();
    });
  };

  const handleSubmit = (car) => {
    if (editing) {
      // only send fields that changed (patch semantics)
      const payload = {};
      Object.keys(car).forEach((k) => {
        if (car[k] !== editing[k]) {
          payload[k] = car[k];
        }
      });
      // if nothing changed, just close
      if (Object.keys(payload).length === 0) {
        setShowForm(false);
        return;
      }
      carService.update(editing.carId, payload).then(() => {
        setShowForm(false);
        load();
      });
    } else {
      carService.create(car).then(() => {
        setShowForm(false);
        load();
      });
    }
  };

  return (
    <Container className="py-4">
      <Row className="mb-3">
        <Col>
          <h2>Cars Management</h2>
        </Col>
        <Col className="text-end">
          {isAdmin && (
            <Button onClick={openNew} variant="success">
              + New Car
            </Button>
          )}
        </Col>
      </Row>

      <CarList
        cars={cars}
        isAdmin={isAdmin}
        onEdit={isAdmin ? openEdit : () => {}}
        onDelete={isAdmin ? handleDelete : () => {}}
        onRecover={isAdmin ? handleRecover : undefined}
      />

      <Modal show={showForm} onHide={() => setShowForm(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editing ? "Edit car" : "Create new car"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CarForm
            initial={editing || undefined}
            countries={countries}
            onSubmit={handleSubmit}
            onCancel={() => setShowForm(false)}
          />
        </Modal.Body>
      </Modal>

      <Modal show={showConfirm} onHide={() => setShowConfirm(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete <strong>{toDelete?.carName}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirm(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
