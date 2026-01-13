import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import { useSearchParams } from "react-router-dom";

import Orchid from "./Orchid";
import orchidsData from "../data/orchids";
import categories from "../data/categories";

function OrchidList() {
  const [searchParams, setSearchParams] = useSearchParams();

  const category = searchParams.get("category") || "All";
  const sortBy = searchParams.get("sort") || "name-asc";
  const query = searchParams.get("q") || "";

  // 1️⃣ FILTER
  const filteredOrchids = orchidsData.filter((o) => {
    const matchCategory = category === "All" || o.categoryId === category;

    const matchQuery = o.orchidName.toLowerCase().includes(query.toLowerCase());

    return matchCategory && matchQuery;
  });

  // 2️⃣ SORT
  const sortedOrchids = [...filteredOrchids].sort((a, b) => {
    switch (sortBy) {
      case "name-asc":
        return a.orchidName.localeCompare(b.orchidName);
      case "name-desc":
        return b.orchidName.localeCompare(a.orchidName);
      case "category":
        return a.category.localeCompare(b.category);
      case "special":
        return b.isSpecial - a.isSpecial;
      default:
        return 0;
    }
  });

  return (
    <>
      {/* ===== FILTER & SORT ===== */}
      <Row className="mb-4">
        <Col md={4}>
          <Form.Select
            value={category}
            onChange={(e) =>
              setSearchParams({
                category: e.target.value,
                sort: sortBy,
                q: query,
              })
            }
          >
            <option value="All">All Categories</option>

            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Form.Select>
        </Col>

        <Col md={4}>
          <Form.Select
            value={sortBy}
            onChange={(e) =>
              setSearchParams({
                category,
                sort: e.target.value,
              })
            }
          >
            <option value="name-asc">Name (A → Z)</option>
            <option value="name-desc">Name (Z → A)</option>
            <option value="category">Category</option>
            <option value="special">Special First</option>
          </Form.Select>
        </Col>
      </Row>

      {/* ===== LIST ===== */}
      <Row xs={1} md={3} className="g-4">
        {sortedOrchids.map((orchid) => (
          <Col key={orchid.id}>
            <Orchid orchid={orchid} />
          </Col>
        ))}
      </Row>
    </>
  );
}

export default OrchidList;
