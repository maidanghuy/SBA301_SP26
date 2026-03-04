import { Table, Button } from "react-bootstrap";
import PropTypes from "prop-types";

export default function CarList({
  cars,
  isAdmin,
  onEdit,
  onDelete,
  onRecover,
}) {
  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Country</th>
          <th>Units</th>
          <th>Price</th>
          <th>Created</th>
          <th>Updated</th>
          {isAdmin && <th>Deleted?</th>}
          {isAdmin && <th className="text-end">Actions</th>}
        </tr>
      </thead>
      <tbody>
        {cars.map((c) => (
          <tr key={c.carId} className={c.deleteFlag ? "table-danger" : ""}>
            <td>{c.carId}</td>
            <td>{c.carName}</td>
            <td>{c.countryName}</td>
            <td>{c.unitsInStock}</td>
            <td>{c.unitPrice}</td>
            <td>
              {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : ""}
            </td>
            <td>
              {c.updatedAt ? new Date(c.updatedAt).toLocaleDateString() : ""}
            </td>
            {isAdmin && <td>{c.deleteFlag ? "Yes" : "No"}</td>}
            {isAdmin && (
              <td className="text-end">
                <Button
                  size="sm"
                  variant="outline-primary"
                  onClick={() => onEdit(c)}
                  className="me-1"
                  disabled={c.deleteFlag}
                >
                  Edit
                </Button>
                {c.deleteFlag ? (
                  <Button
                    size="sm"
                    variant="outline-success"
                    onClick={() => onRecover(c)}
                    className="me-1"
                  >
                    Recover
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="outline-danger"
                    onClick={() => onDelete(c)}
                    disabled={c.deleteFlag}
                  >
                    Delete
                  </Button>
                )}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

CarList.propTypes = {
  cars: PropTypes.array.isRequired,
  isAdmin: PropTypes.bool,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onRecover: PropTypes.func,
};
