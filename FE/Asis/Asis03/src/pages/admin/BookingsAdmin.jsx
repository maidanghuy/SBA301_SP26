import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Table,
  Badge,
  Button,
  Spinner,
  Alert,
  Card,
} from "react-bootstrap";
import bookingService from "../../api/bookingService";

export default function BookingsAdmin() {
  const [rows, setRows] = useState([]);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);

  const [q, setQ] = useState("");
  const [status, setStatus] = useState(""); // "" = all

  const fmtDateTime = (v) => {
    if (!v) return "";
    const d = new Date(v);
    return isNaN(d.getTime()) ? String(v) : d.toLocaleString();
  };

  const fmtDate = (v) => {
    if (!v) return "";
    const d = new Date(v);
    return isNaN(d.getTime()) ? String(v) : d.toLocaleDateString();
  };

  const fmtMoney = (v) => {
    if (v === null || v === undefined) return "";
    const n = Number(v);
    if (Number.isNaN(n)) return String(v);
    return n.toLocaleString(undefined, { maximumFractionDigits: 2 });
  };

  const getRange = (details = []) => {
    if (!Array.isArray(details) || details.length === 0)
      return { checkIn: "", checkOut: "" };
    const starts = details
      .map((d) => d?.startDate)
      .filter(Boolean)
      .sort();
    const ends = details
      .map((d) => d?.endDate)
      .filter(Boolean)
      .sort();
    return { checkIn: starts[0] || "", checkOut: ends[ends.length - 1] || "" };
  };

  // bootstrap variant mapping for statuses
  const statusVariant = (st) => {
    switch (st) {
      case "CONFIRMED":
        return "success";
      case "PENDING":
        return "warning";
      case "CANCELLED":
        return "danger";
      case "COMPLETED":
        return "primary";
      default:
        return "secondary";
    }
  };

  const load = useCallback(async () => {
    setErr("");
    setMsg("");
    setLoading(true);
    try {
      const res = await bookingService.listAll(status ? { status } : undefined);
      const list = Array.isArray(res) ? res : [];
      setRows(list);
    } catch (ex) {
      setErr(ex?.response?.data?.message || ex?.message || "Load failed");
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    let alive = true;
    (async () => {
      if (!alive) return;
      await load();
    })();
    return () => {
      alive = false;
    };
  }, [load]);

  const filtered = useMemo(() => {
    const keyword = q.trim().toLowerCase();
    if (!keyword) return rows;

    return rows.filter((b) => {
      const id = String(b?.bookingReservationId ?? "").toLowerCase();
      const customerId = String(b?.customerId ?? "").toLowerCase();
      const st = String(b?.bookingStatus ?? "").toLowerCase();
      const rooms = Array.isArray(b?.details)
        ? b.details.map((d) => d?.roomNumber).join(",")
        : "";
      return (
        id.includes(keyword) ||
        customerId.includes(keyword) ||
        st.includes(keyword) ||
        rooms.toLowerCase().includes(keyword)
      );
    });
  }, [rows, q]);

  return (
    <Container className="py-4" style={{ maxWidth: 1200 }}>
      <Row className="align-items-center mb-3">
        <Col>
          <h2 className="mb-0">Manage Bookings</h2>
          <small className="text-muted">
            Total: <b>{rows.length}</b>
            {q.trim() && (
              <>
                {" "}
                • Showing: <b>{filtered.length}</b>
              </>
            )}
          </small>
        </Col>
        <Col className="text-end">
          <Button
            variant="secondary"
            size="sm"
            onClick={load}
            disabled={loading}
          >
            Refresh
          </Button>
        </Col>
      </Row>

      {(err || msg) && (
        <Alert variant={err ? "danger" : "success"}>{err || msg}</Alert>
      )}

      <Form className="mb-3">
        <Row className="g-2">
          <Col md>
            <Form.Control
              placeholder="Search by booking id, customer id, status, room number..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </Col>
          <Col xs="auto">
            <Form.Select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">All statuses</option>
              <option value="PENDING">PENDING</option>
              <option value="CONFIRMED">CONFIRMED</option>
              <option value="CANCELLED">CANCELLED</option>
              <option value="COMPLETED">COMPLETED</option>
            </Form.Select>
          </Col>
        </Row>
      </Form>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Booking</th>
            <th>Customer ID</th>
            <th>Booked at</th>
            <th>Check-in</th>
            <th>Check-out</th>
            <th>Status</th>
            <th className="text-end">Total</th>
            <th className="text-end">Rooms</th>
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr>
              <td colSpan={8} className="text-center py-3">
                <Spinner animation="border" />
              </td>
            </tr>
          )}
          {!loading && filtered.length === 0 && (
            <tr>
              <td colSpan={8} className="text-center text-muted py-3">
                No bookings found.
              </td>
            </tr>
          )}
          {filtered.map((b) => {
            const details = Array.isArray(b?.details) ? b.details : [];
            const { checkIn, checkOut } = getRange(details);
            return (
              <>
                <tr key={b.bookingReservationId}>
                  <td className="fw-bold">#{b.bookingReservationId}</td>
                  <td>{b.customerId}</td>
                  <td>{fmtDateTime(b.bookingDate)}</td>
                  <td>{fmtDate(checkIn)}</td>
                  <td>{fmtDate(checkOut)}</td>
                  <td>
                    <Badge bg={statusVariant(b.bookingStatus)}>
                      {b.bookingStatus}
                    </Badge>
                  </td>
                  <td className="text-end fw-bold">{fmtMoney(b.totalPrice)}</td>
                  <td className="text-end">{details.length}</td>
                </tr>
                {details.length > 0 && (
                  <tr>
                    <td colSpan={8} className="bg-light p-2">
                      <Card body>
                        <h6>Room details</h6>
                        <Table size="sm" responsive>
                          <thead>
                            <tr>
                              <th>Room</th>
                              <th>Start</th>
                              <th>End</th>
                              <th className="text-end">Price</th>
                            </tr>
                          </thead>
                          <tbody>
                            {details.map((d, idx) => (
                              <tr
                                key={`${b.bookingReservationId}-${d.roomId}-${idx}`}
                              >
                                <td>
                                  <strong>{d.roomNumber}</strong> (ID:{" "}
                                  {d.roomId})
                                </td>
                                <td>{fmtDate(d.startDate)}</td>
                                <td>{fmtDate(d.endDate)}</td>
                                <td className="text-end">
                                  {fmtMoney(d.actualPrice)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </Card>
                    </td>
                  </tr>
                )}
              </>
            );
          })}
        </tbody>
      </Table>
    </Container>
  );
}
