import { Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const MENU = [
  {
    label: "Dashboard",
    path: "/admin/dashboard",
    roles: ["ADMIN", "STAFF", "MEMBER"],
  },
  { label: "Category", path: "/admin/category", roles: ["ADMIN", "STAFF"] },
  { label: "News", path: "/admin/news", roles: ["ADMIN", "STAFF"] },
  { label: "Users", path: "/admin/users", roles: ["ADMIN"] },
  { label: "Settings", path: "/admin/settings", roles: ["ADMIN"] },
];

export default function AdminMenu() {
  const { user } = useAuth();
  const role = user?.role;

  const visibleItems = MENU.filter((m) => m.roles.includes(role));

  return (
    <Nav className="flex-column">
      <div className="text-uppercase text-secondary small px-3 mb-2">
        Administration
      </div>

      {visibleItems.map((item) => (
        <Nav.Link
          key={item.path}
          as={NavLink}
          to={item.path}
          className="text-light rounded px-3 py-2 mb-1"
          style={({ isActive }) => ({
            background: isActive ? "#0d6efd" : "transparent",
            fontWeight: isActive ? 700 : 400,
          })}
        >
          {item.label}
        </Nav.Link>
      ))}
    </Nav>
  );
}
