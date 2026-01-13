import Form from "react-bootstrap/Form";

function CategoryFilter({ categories, value, onChange }) {
  return (
    <Form.Select value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="All">All Categories</option>

      {categories.map((c) => (
        <option key={c.id} value={c.id}>
          {c.name}
        </option>
      ))}
    </Form.Select>
  );
}

export default CategoryFilter;
