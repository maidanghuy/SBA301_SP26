import { useCallback, useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Table,
  Badge,
  Alert,
  Spinner,
  Card,
} from "react-bootstrap";
import roomService from "../../api/roomService";
import roomTypeService from "../../api/roomTypeService";

export default function RoomsAdmin() {
  const [rooms, setRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);

  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingTypes, setLoadingTypes] = useState(false);

  const [form, setForm] = useState({
    roomNumber: "",
    roomTypeId: "",
    roomMaxCapacity: 2,
    roomPricePerDay: 0,
    roomStatus: true,
    roomDetailDescription: "",
  });

  const loadRooms = useCallback(async () => {
    setErr("");
    setLoading(true);
    try {
      const res = await roomService.getAllAdmin();
      setRooms(res ?? []);
    } catch (ex) {
      setErr(ex?.message || "Failed to load rooms");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadRoomTypes = useCallback(async () => {
    setErr("");
    setLoadingTypes(true);
    try {
      const res = await roomTypeService.getAllAdmin();
      setRoomTypes(res ?? []);
    } catch (ex) {
      setErr(ex?.message || "Failed to load room types");
    } finally {
      setLoadingTypes(false);
    }
  }, []);

  useEffect(() => {
    let alive = true;
    (async () => {
      if (!alive) return;
      await Promise.all([loadRooms(), loadRoomTypes()]);
    })();
    return () => {
      alive = false;
    };
  }, [loadRooms, loadRoomTypes]);

  const onChange = (key) => (e) => {
    const val =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((p) => ({ ...p, [key]: val }));
  };

  const onCreate = async () => {
    setErr("");
    try {
      const payload = {
        roomNumber: form.roomNumber.trim(),
        roomTypeId: Number(form.roomTypeId),
        roomMaxCapacity: Number(form.roomMaxCapacity),
        roomPricePerDay: Number(form.roomPricePerDay),
        roomStatus: Boolean(form.roomStatus),
        roomDetailDescription: form.roomDetailDescription?.trim() || null,
      };

      await roomService.create(payload);

      setForm({
        roomNumber: "",
        roomTypeId: "",
        roomMaxCapacity: 2,
        roomPricePerDay: 0,
        roomStatus: true,
        roomDetailDescription: "",
      });

      await loadRooms();
    } catch (ex) {
      setErr(ex?.message || "Create failed");
    }
  };

  const onDelete = async (roomId) => {
    if (!confirm("Soft delete this room?")) return;
    setErr("");
    try {
      await roomService.remove(roomId);
      await loadRooms();
    } catch (ex) {
      setErr(ex?.message || "Delete failed");
    }
  };

  const formatPrice = (v) => {
    if (v === null || v === undefined) return "-";
    const n = Number(v);
    return n.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const StatusBadge = ({ active }) => (
    <Badge bg={active ? "success" : "danger"}>
      {active ? "ACTIVE" : "INACTIVE"}
    </Badge>
  );

  const canCreate =
    !loading &&
    !loadingTypes &&
    form.roomNumber?.trim() &&
    String(form.roomTypeId || "").length > 0;

  return (
    <Container className="py-4">
      <Row className="align-items-center mb-3">
        <Col>
          <h2 className="mb-0">Manage Rooms</h2>
          <small className="text-muted">
            {loading ? "Loading..." : `${rooms.length} room(s)`}
          </small>
        </Col>
      </Row>

      {err && (
        <Alert variant="danger" className="mb-3">
          {err}
        </Alert>
      )}

      {/* Create form */}
      <Card className="mb-4">
        <Card.Body>
          <Form>
            <Row className="g-3">
              <Col md={4}>
                <Form.Control
                  placeholder="Room number (e.g. 101)"
                  value={form.roomNumber}
                  onChange={onChange("roomNumber")}
                />
              </Col>
              <Col md={4}>
                <Form.Select
                  value={form.roomTypeId}
                  onChange={onChange("roomTypeId")}
                  disabled={loadingTypes}
                >
                  <option value="">
                    {loadingTypes
                      ? "Loading room types..."
                      : "Select room type..."}
                  </option>
                  {roomTypes.map((t) => (
                    <option key={t.roomTypeId} value={t.roomTypeId}>
                      {t.roomTypeName}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col md={4}>
                <Form.Control
                  type="number"
                  min="1"
                  placeholder="Max capacity"
                  value={form.roomMaxCapacity}
                  onChange={onChange("roomMaxCapacity")}
                />
              </Col>
              <Col md={4}>
                <Form.Control
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Price per day"
                  value={form.roomPricePerDay}
                  onChange={onChange("roomPricePerDay")}
                />
              </Col>
              <Col md={4} className="d-flex align-items-center">
                <Form.Check
                  type="checkbox"
                  label="Active"
                  checked={form.roomStatus}
                  onChange={onChange("roomStatus")}
                />
              </Col>
              <Col md={12}>
                <Form.Control
                  as="textarea"
                  placeholder="Description"
                  value={form.roomDetailDescription}
                  onChange={onChange("roomDetailDescription")}
                />
              </Col>
              <Col md={12} className="text-end">
                <Button
                  variant="primary"
                  disabled={!canCreate}
                  onClick={onCreate}
                >
                  Create Room
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      {/* Rooms list */}
      {loading && (
        <div className="text-center py-3">
          <Spinner animation="border" />
        </div>
      )}

      {!loading && rooms.length === 0 && (
        <Alert variant="info">No rooms.</Alert>
      )}

      {!loading && rooms.length > 0 && (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Room No</th>
              <th>Type</th>
              <th>Capacity</th>
              <th>Price / day</th>
              <th>Status</th>
              <th>Description</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((r) => (
              <tr key={r.roomId}>
                <td>{r.roomId}</td>
                <td className="fw-bold">{r.roomNumber}</td>
                <td>{r.roomTypeName}</td>
                <td>{r.roomMaxCapacity ?? "-"}</td>
                <td>{formatPrice(r.roomPricePerDay)}</td>
                <td>
                  <StatusBadge active={!!r.roomStatus} />
                </td>
                <td className="text-truncate" style={{ maxWidth: 200 }}>
                  {r.roomDetailDescription || "-"}
                </td>
                <td>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => onDelete(r.roomId)}
                  >
                    Soft delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <p className="text-muted small">
        * Delete = xóa mềm (set deleteFlag=true).
      </p>
    </Container>
  );
}
