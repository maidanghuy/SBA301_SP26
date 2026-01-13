import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import { useSearchParams } from "react-router-dom";
import CategoryFilter from "./CategoryFilter";

import Orchid from "./Orchid";
import orchidsData from "../data/orchids";
import categories from "../data/categories";

function OrchidList() {
  const [searchParams, setSearchParams] = useSearchParams();

  const category = searchParams.get("category") || "All";
  const sortBy = searchParams.get("sort") || "name-asc";
  const query = searchParams.get("q") || "";

  const categoryMap = Object.fromEntries(categories.map((c) => [c.id, c.name]));

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

      case "category": {
        const catA = categoryMap[a.categoryId] || "";
        const catB = categoryMap[b.categoryId] || "";
        return catA.localeCompare(catB);
      }

      case "special":
        return b.isSpecial - a.isSpecial;

      default:
        return 0;
    }
  });

  const handleCategoryChange = (newCategory) => {
    setSearchParams({
      category: newCategory,
      sort: sortBy,
      q: query,
    });
  };

  return (
    <>
      {/* ===== FILTER & SORT ===== */}
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
