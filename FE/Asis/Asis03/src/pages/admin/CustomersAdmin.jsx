import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  InputGroup,
  Button,
  Table,
  Badge,
  Alert,
  Spinner,
} from "react-bootstrap";
import customerService from "../../api/customerService";

export default function CustomersAdmin() {
  const [data, setData] = useState([]);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const [q, setQ] = useState("");

  const load = useCallback(async () => {
    setErr("");
    setMsg("");
    setLoading(true);
    try {
      // nếu backend hỗ trợ params, bạn có thể truyền: { q } hoặc { keyword: q }
      const res = await customerService.list();
      setData(Array.isArray(res) ? res : []);
    } catch (ex) {
      setErr(ex?.response?.data?.message || ex?.message || "Load failed");
    } finally {
      setLoading(false);
    }
  }, []);

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
    if (!keyword) return data;

    return data.filter((u) => {
      const id = String(u?.id ?? "").toLowerCase();
      const email = String(u?.email ?? "").toLowerCase();
      const fullName = String(u?.fullName ?? "").toLowerCase();
      const role = String(u?.role ?? "").toLowerCase();
      return (
        id.includes(keyword) ||
        email.includes(keyword) ||
        fullName.includes(keyword) ||
        role.includes(keyword)
      );
    });
  }, [data, q]);

  const badge = (text, type = "secondary") => {
    const variant =
      type === "green"
        ? "success"
        : type === "red"
          ? "danger"
          : type === "blue"
            ? "primary"
            : type === "amber"
              ? "warning"
              : "secondary";
    return <Badge bg={variant}>{text}</Badge>;
  };

  const onDelete = async (id) => {
    const ok = window.confirm(`Delete customer #${id}?`);
    if (!ok) return;

    setErr("");
    setMsg("");
    setDeletingId(id);

    try {
      await customerService.remove(id);
      setMsg(`Deleted customer #${id}`);
      await load();
    } catch (ex) {
      setErr(ex?.response?.data?.message || ex?.message || "Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Container className="py-4" style={{ maxWidth: 1100 }}>
      <Row className="align-items-center mb-3">
        <Col>
          <h2 className="mb-0">Manage Customers</h2>
          <small className="text-muted">
            Total: <b>{data.length}</b>
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
            disabled={loading || deletingId !== null}
          >
            Refresh
          </Button>
        </Col>
      </Row>

      {(err || msg) && (
        <Alert variant={err ? "danger" : "success"}>{err || msg}</Alert>
      )}

      <Form className="mb-3">
        <Row className="g-2 align-items-center">
          <Col md>
            <InputGroup>
              <Form.Control
                placeholder="Search by ID, email, name, role..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </InputGroup>
          </Col>
        </Row>
      </Form>

      {!loading && filtered.length > 0 && (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Email</th>
              <th>Full name</th>
              <th>Role</th>
              <th>Status</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => {
              const role = u?.role || "N/A";
              const active = u?.active;
              return (
                <tr key={u.id}>
                  <td className="fw-bold">#{u.id}</td>
                  <td className="text-monospace">{u.email}</td>
                  <td>{u.fullName}</td>
                  <td>
                    {badge(
                      role,
                      role === "ADMIN"
                        ? "blue"
                        : role === "STAFF"
                          ? "amber"
                          : "secondary",
                    )}
                  </td>
                  <td>
                    {active === undefined
                      ? badge("UNKNOWN", "secondary")
                      : active
                        ? badge("ACTIVE", "green")
                        : badge("INACTIVE", "red")}
                  </td>
                  <td className="text-end">
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => onDelete(u.id)}
                      disabled={deletingId !== null}
                    >
                      {deletingId === u.id ? "Deleting..." : "Delete"}
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}
      {loading && (
        <div className="text-center py-3">
          <Spinner animation="border" />
        </div>
      )}
      {!loading && filtered.length === 0 && (
        <Alert variant="info">No customers found.</Alert>
      )}
    </Container>
  );
}
