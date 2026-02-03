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
import { categoryService } from "../../api/categoryService";
import CategoryModal from "../../components/common/CategoryModal";

export default function Category() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await categoryService.search({
        q: search,
      });
      setCategories(res.data.data);
    } catch (error) {
      console.error("Failed to fetch categories", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [search]);

  const handleCreate = () => {
    setSelectedCategory(null);
    setShowModal(true);
  };

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setShowModal(true);
  };

  const handleSave = async (data) => {
    try {
      if (selectedCategory) {
        await categoryService.update(selectedCategory.categoryId, data);
      } else {
        await categoryService.create({
          ...data,
        });
      }
      setShowModal(false);
      fetchCategories();
    } catch (error) {
      console.error("Save failed", error);
    }
  };

  const handleSoftDelete = async (categoryId) => {
    if (!window.confirm("Soft delete this category?")) return;
    try {
      await categoryService.softDelete(categoryId);
      fetchCategories();
    } catch (error) {
      console.error("Soft delete failed", error);
    }
  };

  const handleRecover = async (categoryId) => {
    if (!window.confirm("Recover this category?")) return;
    try {
      await categoryService.recover(categoryId);
      fetchCategories();
    } catch (error) {
      console.error("Recover failed", error);
    }
  };

  return (
    <Container fluid className="mt-4">
      <Row className="mb-3 align-items-center">
        <Col>
          <h2>Category Management</h2>
        </Col>
        <Col className="text-end">
          <Button onClick={handleCreate}>+ New Category</Button>
        </Col>
      </Row>

      <Row className="mb-3 align-items-center">
        <Col md={4}>
          <Form.Control
            placeholder="Search category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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
              <th>Description</th>
              <th>Parent</th>
              <th>Status</th>
              <th>Deleted</th>
              <th width="220">Action</th>
            </tr>
          </thead>

          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center">
                  No data
                </td>
              </tr>
            ) : (
              categories.map((c) => (
                <tr
                  key={c.categoryId}
                  className={c.deleteFlag ? "table-secondary" : ""}
                >
                  <td>{c.categoryId}</td>
                  <td>{c.categoryName}</td>
                  <td>{c.categoryDescription}</td>
                  <td>{c.parentCategoryId ?? "-"}</td>
                  <td>
                    <Badge bg={c.isActive ? "success" : "secondary"}>
                      {c.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </td>
                  <td>
                    {c.deleteFlag ? (
                      <Badge bg="danger">Deleted</Badge>
                    ) : (
                      <Badge bg="info">No</Badge>
                    )}
                  </td>
                  <td>
                    <Button
                      size="sm"
                      variant="warning"
                      disabled={c.deleteFlag}
                      onClick={() => handleEdit(c)}
                    >
                      Edit
                    </Button>

                    {c.deleteFlag ? (
                      <Button
                        size="sm"
                        variant="success"
                        className="ms-2"
                        onClick={() => handleRecover(c.categoryId)}
                      >
                        Recover
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="danger"
                        className="ms-2"
                        onClick={() => handleSoftDelete(c.categoryId)}
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

      <CategoryModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSave}
        initialData={selectedCategory}
        categories={categories.filter((x) => !x.deleteFlag)}
      />
    </Container>
  );
}
