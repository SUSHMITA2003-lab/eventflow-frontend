import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  useLocation();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const name = localStorage.getItem("name");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        EventFlow
      </Link>

      <div className="navbar-links">
        <Link to="/">Home</Link>

        <Link to="/events">
          Events
        </Link>

        {token && role === "USER" && (
          <>
            <Link to="/my-registrations">
              My Registrations
            </Link>

            <Link to="/my-tickets">
              My Tickets
            </Link>
          </>
        )}

        {token && role === "ORGANIZER" && (
          <>
            <Link to="/organizer">
              Dashboard
            </Link>

            <Link to="/organizer/scan">
              Scan Ticket
            </Link>
          </>
        )}

        {!token && (
          <>
            <Link to="/login">
              Login
            </Link>

            <Link
              to="/register"
              className="register-button"
            >
              Get Started
            </Link>
          </>
        )}

        {token && (
          <>
            <span className="navbar-user">
              Hi, {name}
            </span>

            <button
              className="logout-button"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;