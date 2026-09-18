import { Link } from "react-router-dom";

function Home() {
  return (
    <main className="home-page">
      <section className="hero-section">
        <div className="hero-content">
          <span className="hero-badge">
            Discover. Register. Experience.
          </span>

          <h1>
            Find events that
            <span> move you.</span>
          </h1>

          <p>
            Discover upcoming events, reserve your
            seat, access QR tickets, and enjoy a
            seamless event experience with EventFlow.
          </p>

          <div className="hero-buttons">
            <Link
              to="/events"
              className="primary-button"
            >
              Explore Events
            </Link>

            {!localStorage.getItem("token") && (
              <Link
                to="/register"
                className="secondary-button"
              >
                Create Account
              </Link>
            )}
          </div>
        </div>

        <div className="hero-card">
          <div className="event-preview">
            <span className="event-label">
              EventFlow
            </span>

            <h3>
              One platform for your complete event journey.
            </h3>

            <p>
              Discover events, register, generate
              secure QR tickets and check in quickly.
            </p>

            <div className="event-info">
              <span>🎟 Digital Tickets</span>
              <span>📱 QR Check-In</span>
              <span>👥 Organizer Dashboard</span>
            </div>

            <Link
              to="/events"
              className="dark-button"
            >
              Browse Events
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;