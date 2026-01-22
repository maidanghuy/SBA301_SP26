import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="text-center">
      <h1 className="display-4">404</h1>
      <p className="lead">Page not found</p>

      <Button as={Link} to="/" variant="primary">
        Go to Home
      </Button>
    </div>
  );
}

export default NotFound;
