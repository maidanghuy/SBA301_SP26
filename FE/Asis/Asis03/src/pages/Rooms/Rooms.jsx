import { useEffect, useState } from "react";
import roomService from "../../api/roomService";
import {
  Container,
  Form,
  Row,
  Col,
  Button,
  Table,
  Alert,
  Badge,
  Spinner,
} from "react-bootstrap";

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [q, setQ] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  // load nhận tham số searchText
  const load = async (searchText) => {
    setErr("");
    setLoading(true);
    try {
      const res = await roomService.getAll(
        searchText ? { q: searchText } : undefined,
      );
      setRooms(res ?? []);
    } catch (ex) {
      setErr(ex?.message || "Failed to load rooms");
    } finally {
      setLoading(false);
    }
  };

  // load lần đầu khi mount
  useEffect(() => {
    load();
  }, []);

  const onSearch = async (e) => {
    e.preventDefault();
    await load(q);
  };

  const formatPrice = (v) => {
    if (v === null || v === undefined) return "-";
    const n = Number(v);
    return n.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <Container className="py-4">
      <h2>Rooms</h2>
      <Form onSubmit={onSearch} className="mb-3">
        <Row className="g-2">
          <Col>
            <Form.Control
              placeholder="Search by room number..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </Col>
          <Col xs="auto">
            <Button type="submit" disabled={loading} variant="primary">
              {loading ? <Spinner animation="border" size="sm" /> : "Search"}
            </Button>
          </Col>
        </Row>
      </Form>
      {err && <Alert variant="danger">{err}</Alert>}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Room No</th>
            <th>Type</th>
            <th>Capacity</th>
            <th>Price / day</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {!loading && rooms.length === 0 && (
            <tr>
              <td colSpan={5} className="text-center py-3">
                No rooms found.
              </td>
            </tr>
          )}
          {rooms.map((r) => (
            <tr key={r.roomId}>
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
    </Container>
  );
}
