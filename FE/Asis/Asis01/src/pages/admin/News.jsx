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
import { newsService } from "../../api/newsService";
import { categoryService } from "../../api/categoryService";
import { tagService } from "../../api/tagService";
import NewsModal from "../../components/common/NewsModal";

export default function News() {
  const [newsList, setNewsList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const [includeDeleted, setIncludeDeleted] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [newsRes, cateRes, tagRes] = await Promise.all([
        newsService.search({ q: search, includeDeleted }),
        categoryService.getAll(),
        tagService.getAll(),
      ]);

      setNewsList(newsRes.data.data);
      setCategories(cateRes.data.data);
      setTags(tagRes.data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [search, includeDeleted]);

  const handleSave = async (data) => {
    try {
      if (selectedNews) {
        await newsService.update(selectedNews.newsArticleId, data);
      } else {
        await newsService.create(data);
      }
      setShowModal(false);
      fetchData();
    } catch (e) {
      console.error("Save failed", e);
    }
  };

  const handleSoftDelete = async (newsArticleId) => {
    if (!window.confirm("Soft delete this news?")) return;
    try {
      await newsService.softDelete(newsArticleId);
      fetchData();
    } catch (e) {
      console.error("Soft delete failed", e);
    }
  };

  const handleRecover = async (newsArticleId) => {
    if (!window.confirm("Recover this news?")) return;
    try {
      await newsService.recover(newsArticleId);
      fetchData();
    } catch (e) {
      console.error("Recover failed", e);
    }
  };

  return (
    <Container fluid className="mt-4">
      <Row className="mb-3 align-items-center">
        <Col>
          <h2>News Management</h2>
        </Col>
        <Col className="text-end">
          <Button onClick={() => setShowModal(true)}>+ New News</Button>
        </Col>
      </Row>

      <Row className="mb-3 align-items-center">
        <Col md={4}>
          <Form.Control
            placeholder="Search news..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Col>

        <Col md={3} className="mt-2 mt-md-0">
          <Form.Check
            type="switch"
            id="includeDeletedNews"
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
              <th>Title</th>
              <th>Category</th>
              <th>Status</th>
              <th>Tags</th>
              <th>Deleted</th>
              <th width="220">Action</th>
            </tr>
          </thead>

          <tbody>
            {newsList.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center">
                  No data
                </td>
              </tr>
            ) : (
              newsList.map((n) => (
                <tr
                  key={n.newsArticleId}
                  className={n.deleteFlag ? "table-secondary" : ""}
                >
                  <td>{n.newsArticleId}</td>
                  <td>{n.newsTitle}</td>
                  <td>{n.categoryName ?? "-"}</td>
                  <td>
                    <Badge
                      bg={
                        n.newsStatus === "PUBLISHED" ? "success" : "secondary"
                      }
                    >
                      {n.newsStatus}
                    </Badge>
                  </td>
                  <td>
                    {n.tags?.length ? (
                      n.tags.map((t) => (
                        <Badge bg="info" key={t.tagId} className="me-1">
                          {t.tagName}
                        </Badge>
                      ))
                    ) : (
                      <span>-</span>
                    )}
                  </td>
                  <td>
                    {n.deleteFlag ? (
                      <Badge bg="danger">Deleted</Badge>
                    ) : (
                      <Badge bg="info">No</Badge>
                    )}
                  </td>

                  <td>
                    <Button
                      size="sm"
                      variant="warning"
                      disabled={n.deleteFlag}
                      onClick={() => {
                        setSelectedNews(n);
                        setShowModal(true);
                      }}
                    >
                      Edit
                    </Button>

                    {n.deleteFlag ? (
                      <Button
                        size="sm"
                        variant="success"
                        className="ms-2"
                        onClick={() => handleRecover(n.newsArticleId)}
                      >
                        Recover
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="danger"
                        className="ms-2"
                        onClick={() => handleSoftDelete(n.newsArticleId)}
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

      <NewsModal
        show={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedNews(null);
        }}
        onSubmit={handleSave}
        initialData={selectedNews}
        categories={categories.filter((c) => !c.deleteFlag)}
        tags={tags}
      />
    </Container>
  );
}
