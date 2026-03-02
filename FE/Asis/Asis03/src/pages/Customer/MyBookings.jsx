import { useEffect, useState } from "react";
import bookingService from "../../api/bookingService";
import { Container, Table, Alert, Spinner, Badge } from "react-bootstrap";

export default function MyBookings() {
  const [rows, setRows] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setErr("");
        setLoading(true);

        const res = await bookingService.myHistory();
        const list = Array.isArray(res) ? res : [];

        if (!mounted) return;
        setRows(list);
      } catch (ex) {
        if (!mounted) return;
        setErr(ex?.response?.data?.message || ex?.message || "Load failed");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

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
    return n.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
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
  const statusVariant = (status) => {
    switch (status) {
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

  return (
    <Container className="py-4 mx-auto max-w-1100">
      <h2>My Booking History</h2>
      <p className="text-muted">Total bookings: {rows.length}</p>

      {err && <Alert variant="danger">{err}</Alert>}
      {loading && (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      )}

      {!loading && (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Booking #</th>
              <th>Booked at</th>
              <th>Check-in</th>
              <th>Check-out</th>
              <th>Status</th>
              <th className="text-end">Total</th>
              <th className="text-end">Rooms</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center text-muted">
                  No bookings yet.
                </td>
              </tr>
            )}
            {rows.map((b) => {
              const details = Array.isArray(b?.details) ? b.details : [];
              const { checkIn, checkOut } = getRange(details);
              return (
                <tr key={b.bookingReservationId}>
                  <td className="fw-bold">#{b.bookingReservationId}</td>
                  <td>{fmtDateTime(b.bookingDate)}</td>
                  <td>{fmtDate(checkIn)}</td>
                  <td>{fmtDate(checkOut)}</td>
                  <td>
                    <Badge bg={statusVariant(b.bookingStatus)}>
                      {b.bookingStatus}
                    </Badge>
                  </td>
                  <td className="text-end">{fmtMoney(b.totalAmount)}</td>
                  <td className="text-end">
                    {details.map((d) => d.roomNumber).join(", ")}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}
    </Container>
  );
}
