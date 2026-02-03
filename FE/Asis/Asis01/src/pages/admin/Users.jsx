import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Form,
  Spinner,
  Badge,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import { accountService } from "../../api/accountService";
import UserModal from "../../components/common/UserModal";

export default function UsersManager() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [includeDeleted, setIncludeDeleted] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await accountService.search({ q: search, includeDeleted });
      setUsers(res.data.data);
    } catch (e) {
      console.error("Fetch users failed", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search, includeDeleted]);

  const handleCreate = () => {
    setSelectedUser(null);
    setShowModal(true);
  };

  const handleEdit = (u) => {
    setSelectedUser(u);
    setShowModal(true);
  };

  const handleSave = async (payload) => {
    try {
      if (selectedUser) {
        await accountService.update(selectedUser.accountId, payload);
      } else {
        await accountService.create(payload);
      }
      setShowModal(false);
      fetchUsers();
    } catch (e) {
      console.error("Save failed", e);
    }
  };

  const handleSoftDelete = async (id) => {
    if (!window.confirm("Soft delete this user?")) return;
    await accountService.softDelete(id);
    fetchUsers();
  };

  const handleRecover = async (id) => {
    if (!window.confirm("Recover this user?")) return;
    await accountService.recover(id);
    fetchUsers();
  };

  return (
    <Container fluid className="mt-4">
      <Row className="mb-3 align-items-center">
        <Col>
          <h2>Users Manager</h2>
        </Col>
        <Col className="text-end">
          <Button onClick={handleCreate}>+ New User</Button>
        </Col>
      </Row>

      <Row className="mb-3 align-items-center">
        <Col md={4}>
          <Form.Control
            placeholder="Search user..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Col>
        <Col md={3} className="mt-2 mt-md-0">
          <Form.Check
            type="switch"
            id="includeDeletedUsers"
            label="Show deleted"
            checked={includeDeleted}
            onChange={(e) => setIncludeDeleted(e.target.checked)}
          />
        </Col>
      </Row>

      {loading ? (
        <div className="text-center mt-5">
          <Spinner animation="border" />
        </div>
      ) : (
        <Table bordered hover responsive>
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Deleted</th>
              <th width="220">Action</th>
            </tr>
          </thead>

          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center">
                  No data
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr
                  key={u.accountId}
                  className={u.deleteFlag ? "table-secondary" : ""}
                >
                  <td>{u.accountId}</td>
                  <td>{u.accountName}</td>
                  <td>{u.accountEmail}</td>
                  <td>
                    <Badge bg="primary">{u.accountRole}</Badge>
                  </td>
                  <td>
                    {u.deleteFlag ? (
                      <Badge bg="danger">Deleted</Badge>
                    ) : (
                      <Badge bg="info">No</Badge>
                    )}
                  </td>
                  <td>
                    <Button
                      size="sm"
                      variant="warning"
                      disabled={u.deleteFlag}
                      onClick={() => handleEdit(u)}
                    >
                      Edit
                    </Button>

                    {u.deleteFlag ? (
                      <Button
                        size="sm"
                        variant="success"
                        className="ms-2"
                        onClick={() => handleRecover(u.accountId)}
                      >
                        Recover
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="danger"
                        className="ms-2"
                        onClick={() => handleSoftDelete(u.accountId)}
                      >
                        Delete
                      </Button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      )}

      <UserModal
        show={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedUser(null);
        }}
        onSubmit={handleSave}
        initialData={selectedUser}
      />
    </Container>
  );
}
