import { Link, NavLink } from "react-router-dom";
import "./Nav.css";

export default function Navbar() {
  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/login", label: "Login" },
    { path: "/register", label: "Register" },
    { path: "/cars", label: "Browse Cars" },
  ];

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        CarRental
      </Link>

      <div className="navbar-links">
        {navLinks.map(({ path, label }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              isActive ? "navlink active" : "navlink"
            }
          >
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
