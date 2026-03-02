import { useEffect, useMemo, useState } from "react";
import roomService from "../../api/roomService";
import bookingService from "../../api/bookingService";
import {
  Container,
  Button,
  Row,
  Col,
  Form,
  Table,
  Badge,
  Alert,
  Card,
} from "react-bootstrap";

export default function NewBooking() {
  const [rooms, setRooms] = useState([]); // array RoomResponse
  const [selectedIds, setSelectedIds] = useState([]);

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  const [q, setQ] = useState("");
  const [onlyActive, setOnlyActive] = useState(true);

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const [createdBooking, setCreatedBooking] = useState(null); // booking object returned directly from service (interceptor unwraps ApiResponse)

  useEffect(() => {
    let alive = true;

    (async () => {
      setErr("");
      setLoading(true);
      try {
        const res = await roomService.getAll();
        const list = res ?? [];
        if (!alive) return;
        setRooms(Array.isArray(list) ? list : []);
      } catch (ex) {
        if (!alive) return;
        setErr(ex?.message || "Failed to load rooms");
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  const toggle = (roomId) => {
    setSelectedIds((prev) =>
      prev.includes(roomId)
        ? prev.filter((x) => x !== roomId)
        : [...prev, roomId],
    );
  };

  const canSubmit = useMemo(() => {
    if (!checkIn || !checkOut) return false;
    if (selectedIds.length === 0) return false;
    return new Date(checkOut) > new Date(checkIn);
  }, [checkIn, checkOut, selectedIds]);

  const filteredRooms = useMemo(() => {
    const keyword = q.trim().toLowerCase();
    return (Array.isArray(rooms) ? rooms : [])
      .filter((r) => (onlyActive ? !!r.roomStatus : true))
      .filter((r) => {
        if (!keyword) return true;
        const num = (r.roomNumber || "").toLowerCase();
        const type = (r.roomTypeName || "").toLowerCase();
        return num.includes(keyword) || type.includes(keyword);
      });
  }, [rooms, q, onlyActive]);

  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    const a = new Date(checkIn);
    const b = new Date(checkOut);
    const diff = b - a;
    if (!(diff > 0)) return 0;
    return Math.round(diff / (1000 * 60 * 60 * 24));
  }, [checkIn, checkOut]);

  const estimatedTotal = useMemo(() => {
    if (nights <= 0) return 0;
    const map = new Map((rooms || []).map((r) => [r.roomId, r]));
    return selectedIds.reduce((sum, id) => {
      const r = map.get(id);
      const price = Number(r?.roomPricePerDay ?? 0);
      return sum + price * nights;
    }, 0);
  }, [rooms, selectedIds, nights]);

  const formatPrice = (v) => {
    if (v === null || v === undefined) return "-";
    const n = Number(v);
    if (Number.isNaN(n)) return String(v);
    return n.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const StatusBadge = ({ active }) => (
    <span
      style={{
        display: "inline-block",
        padding: "2px 10px",
        borderRadius: 999,
        fontSize: 12,
        border: "1px solid #eee",
        background: active ? "#eefbf1" : "#fff1f1",
      }}
    >
      {active ? "ACTIVE" : "INACTIVE"}
    </span>
  );

  const onSubmit = async () => {
    setErr("");
    setMsg("");
    setCreatedBooking(null);

    if (!canSubmit) {
      setErr(
        "Please enter customerId, select dates (check-out > check-in) and at least 1 room.",
      );
      return;
    }

    const payload = {
      rooms: selectedIds.map((id) => ({
        roomId: id,
        startDate: checkIn,
        endDate: checkOut,
      })),
    };

    try {
      setSubmitting(true);
      const res = await bookingService.create(payload);
      // res là ApiResponse: { status, message, data }
      const data = res;
      setCreatedBooking(data || null);
      setMsg(res?.message || "Booking created");
      // reset selection (tuỳ bạn)
      // setSelectedIds([]);
    } catch (ex) {
      // nếu backend trả ApiResponse lỗi, axios thường có ex.response.data
      // (message field is read directly)
      const apiMsg = ex?.response?.data?.message;
      setErr(apiMsg || ex?.message || "Create booking failed");
    } finally {
      setSubmitting(false);
    }
  };

  const onCancelCreated = async () => {
    if (!createdBooking?.bookingReservationId) return;
    setErr("");
    setMsg("");
    try {
      setSubmitting(true);
      const res = await bookingService.cancel(
        createdBooking.bookingReservationId,
      );
      setCreatedBooking(res || null);
      setMsg(res?.message || "Cancelled");
    } catch (ex) {
      const apiMsg = ex?.response?.data?.message;
      setErr(apiMsg || ex?.message || "Cancel failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container className="py-4 mx-auto max-w-980">
      <Row className="align-items-baseline mb-2">
        <Col>
          <h2 className="mb-0">New Booking</h2>
        </Col>
        <Col className="text-end text-muted" xs="auto">
          {loading ? "Loading..." : `${filteredRooms.length} room(s)`}
        </Col>
      </Row>

      {err && <Alert variant="danger">{err}</Alert>}
      {msg && <Alert variant="success">{msg}</Alert>}

      {/* search, filters and date selectors */}
      <Form className="mb-3">
        <Row className="g-2 align-items-center">
          <Col md>
            <Form.Control
              placeholder="Search room number / type..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </Col>
          <Col xs="auto">
            <Form.Check
              type="checkbox"
              label="Active only"
              checked={onlyActive}
              onChange={(e) => setOnlyActive(e.target.checked)}
            />
          </Col>
          <Col xs={12} md={3}>
            <Form.Label>Check-in</Form.Label>
            <Form.Control
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
            />
          </Col>
          <Col xs={12} md={3}>
            <Form.Label>Check-out</Form.Label>
            <Form.Control
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
            />
          </Col>
          <Col xs="auto">
            <div className="d-flex flex-column align-items-end">
              <small>Nights: {nights}</small>
              <small>Estimated: {formatPrice(estimatedTotal)}</small>
            </div>
          </Col>
          <Col xs="auto">
            <Button
              variant="primary"
              disabled={!canSubmit || submitting}
              onClick={onSubmit}
            >
              {submitting ? "Saving..." : "Book"}
            </Button>
          </Col>
        </Row>
      </Form>

      {/* room list */}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th></th>
            <th>Room #</th>
            <th>Type</th>
            <th>Capacity</th>
            <th>Price / day</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredRooms.map((r) => (
            <tr key={r.roomId}>
              <td>
                <Form.Check
                  type="checkbox"
                  checked={selectedIds.includes(r.roomId)}
                  onChange={() => toggle(r.roomId)}
                />
              </td>
              <td>{r.roomNumber}</td>
              <td>{r.roomTypeName}</td>
              <td>{r.roomMaxCapacity}</td>
              <td>{formatPrice(r.roomPricePerDay)}</td>
              <td>
                <Badge bg={r.roomStatus ? "success" : "danger"}>
                  {r.roomStatus ? "ACTIVE" : "INACTIVE"}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {createdBooking && (
        <Card className="mt-4">
          <Card.Header>Booking Result</Card.Header>
          <Card.Body>
            <p>
              Reservation #{createdBooking.bookingReservationId} created with
              {createdBooking?.message && ` message: ${createdBooking.message}`}
            </p>
            {createdBooking.bookingReservationId && (
              <Button variant="outline-danger" onClick={onCancelCreated}>
                Cancel booking
              </Button>
            )}
          </Card.Body>
        </Card>
      )}
    </Container>
  );
}
