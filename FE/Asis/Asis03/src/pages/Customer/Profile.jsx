import { useCallback, useEffect, useMemo, useState } from "react";
import customerService from "../../api/customerService";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Alert,
  Spinner,
  Card,
} from "react-bootstrap";

export default function Profile() {
  const [form, setForm] = useState({ fullName: "", phone: "" });
  const [meta, setMeta] = useState({ email: "", role: "" });
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const isValid = useMemo(() => {
    const nameOk = (form.fullName || "").trim().length >= 2;
    const phoneOk =
      (form.phone || "").trim().length === 0 ||
      (form.phone || "").trim().length >= 8;
    return nameOk && phoneOk;
  }, [form.fullName, form.phone]);

  const load = useCallback(async () => {
    setErr("");
    setMsg("");
    setLoading(true);
    try {
      const me = await customerService.myProfile();
      setForm({
        fullName: me?.fullName || "",
        phone: me?.phone || "",
      });
      setMeta({
        email: me?.email || "",
        role: me?.role || "",
      });
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

  const onSave = async () => {
    setErr("");
    setMsg("");
    setSaving(true);
    try {
      await customerService.updateMyProfile({
        fullName: form.fullName?.trim(),
        phone: form.phone?.trim(),
      });
      setMsg("Saved!");
      await load();
    } catch (ex) {
      setErr(ex?.response?.data?.message || ex?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container className="py-4" style={{ maxWidth: 720 }}>
      <Row className="align-items-center mb-3">
        <Col>
          <h2>My Profile</h2>
          <p className="text-muted">Update your personal information.</p>
        </Col>
        <Col className="text-end">
          <Button
            variant="secondary"
            size="sm"
            onClick={load}
            disabled={loading || saving}
          >
            Refresh
          </Button>
        </Col>
      </Row>

      {(err || msg) && (
        <Alert variant={err ? "danger" : "success"}>{err || msg}</Alert>
      )}

      <Card>
        <Card.Header>Account Details</Card.Header>
        <Card.Body>
          {loading ? (
            <div className="text-center">
              <Spinner animation="border" />
            </div>
          ) : (
            <Form>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="profileEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control value={meta.email} disabled plaintext />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="profileRole">
                    <Form.Label>Role</Form.Label>
                    <Form.Control value={meta.role} disabled plaintext />
                  </Form.Group>
                </Col>
              </Row>
              <hr />
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="profileFullname">
                    <Form.Label>Full name</Form.Label>
                    <Form.Control
                      type="text"
                      value={form.fullName}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, fullName: e.target.value }))
                      }
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="profilePhone">
                    <Form.Label>Phone</Form.Label>
                    <Form.Control
                      type="text"
                      value={form.phone}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, phone: e.target.value }))
                      }
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Button
                variant="primary"
                onClick={onSave}
                disabled={!isValid || saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </Form>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}
