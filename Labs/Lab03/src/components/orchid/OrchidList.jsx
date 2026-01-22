import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

import CategoryFilter from "../filters/CategoryFilter";
import Orchid from "./OrchidCard";

import { orchidService } from "../../api/orchidService";
import { categoryService } from "../../api/categoryService";

function OrchidList() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [orchids, setOrchids] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const category = searchParams.get("category") || "All";
  const sortBy = searchParams.get("sort") || "name-asc";
  const query = searchParams.get("q") || "";

  // load categories once
  useEffect(() => {
    categoryService.getAll().then((res) => setCategories(res.data));
  }, []);

  // 🔥 CALL API WHEN QUERY CHANGES
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);

      try {
        const res = await orchidService.search({
          category,
          sortBy: sortBy,
          q: query,
        });

        if (isMounted) {
          setOrchids(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [category, sortBy, query]);

  const handleCategoryChange = (newCategory) => {
    setSearchParams({
      category: newCategory,
      sort: sortBy,
      q: query,
    });
  };

  return (
    <>
      {/* ===== FILTER ===== */}
      <Row className="mb-4">
        <Col md={4}>
          <CategoryFilter
            categories={categories}
            value={category}
            onChange={handleCategoryChange}
          />
        </Col>

        <Col md={4}>
          <Form.Select
            value={sortBy}
            onChange={(e) =>
              setSearchParams({
                category,
                sort: e.target.value,
                q: query,
              })
            }
          >
            <option value="name-asc">Name (A → Z)</option>
            <option value="name-desc">Name (Z → A)</option>
            <option value="special">Special First</option>
          </Form.Select>
        </Col>
      </Row>

      {/* ===== STATUS ===== */}
      {loading && <Alert variant="info">Loading...</Alert>}

      {!loading && orchids.length === 0 && (
        <Alert variant="warning">❌ No orchids found.</Alert>
      )}

      {/* ===== LIST ===== */}
      <Row xs={1} md={3} className="g-4">
        {orchids.map((orchid) => (
          <Col key={orchid.id}>
            <Orchid orchid={orchid} />
          </Col>
        ))}
      </Row>
    </>
  );
}

export default OrchidList;
