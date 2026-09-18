import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import api from "../api/axios";

function MyRegistrations() {
  const navigate = useNavigate();

  const [registrations, setRegistrations] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const loadRegistrations = async () => {
    try {
      const response =
        await api.get(
          "/api/registrations/my"
        );

      setRegistrations(
        response.data
      );

    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Unable to load registrations."
      );

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRegistrations();
  }, []);

  const generateTicket = async (
    registrationId
  ) => {
    try {
      await api.post(
        `/api/tickets/generate/${registrationId}`
      );

      navigate("/my-tickets");

    } catch (error) {
      const message =
        error.response?.data?.message;

      if (
        message ===
        "Ticket already generated for this registration"
      ) {
        navigate("/my-tickets");
        return;
      }

      alert(
        message ||
        "Unable to generate ticket."
      );
    }
  };

  const cancelRegistration =
    async (registrationId) => {

      if (
        !window.confirm(
          "Cancel this registration?"
        )
      ) {
        return;
      }

      try {
        await api.put(
          `/api/registrations/${registrationId}/cancel`
        );

        await loadRegistrations();

      } catch (error) {
        alert(
          error.response?.data?.message ||
          "Unable to cancel registration."
        );
      }
    };

  const registerAgain =
    async (eventId) => {

      try {
        await api.post(
          `/api/registrations/events/${eventId}`
        );

        await loadRegistrations();

      } catch (error) {
        alert(
          error.response?.data?.message ||
          "Unable to register again."
        );
      }
    };

  if (loading) {
    return (
      <main className="events-page">
        <p>
          Loading registrations...
        </p>
      </main>
    );
  }

  return (
    <main className="events-page">
      <div className="events-header">
        <span>My Events</span>

        <h1>
          My Registrations
        </h1>

        <p>
          Manage your registrations and
          event tickets.
        </p>
      </div>

      {error && (
        <div className="events-error">
          {error}
        </div>
      )}

      <div className="events-grid">
        {registrations.length === 0 ? (
          <p>
            No registrations yet.{" "}
            <Link to="/events">
              Browse events
            </Link>
          </p>
        ) : (
          registrations.map(
            (registration) => (
              <article
                className="event-card"
                key={registration.id}
              >
                <div className="event-card-top">
                  <span className="event-category">
                    Registration #
                    {registration.id}
                  </span>

                  <span className="status-badge">
                    {registration.status}
                  </span>
                </div>

                <h2>
                  {
                    registration.event
                      ?.title
                  }
                </h2>

                <p className="event-description">
                  {
                    registration.event
                      ?.description
                  }
                </p>

                <div className="event-details">
                  <span>
                    📍{" "}
                    {
                      registration.event
                        ?.location
                    }
                  </span>

                  <span>
                    📅{" "}
                    {
                      registration.event
                        ?.eventDate
                    }
                  </span>

                  <span>
                    🕐{" "}
                    {
                      registration.event
                        ?.startTime
                    }
                  </span>
                </div>

                {registration.status ===
                  "CONFIRMED" && (
                  <div className="card-actions">
                    <button
                      className="event-view-button"
                      onClick={() =>
                        generateTicket(
                          registration.id
                        )
                      }
                    >
                      Generate Ticket
                    </button>

                    <button
                      className="danger-outline-button"
                      onClick={() =>
                        cancelRegistration(
                          registration.id
                        )
                      }
                    >
                      Cancel Registration
                    </button>
                  </div>
                )}

                {registration.status ===
                  "CANCELLED" && (
                  <button
                    className="event-view-button"
                    onClick={() =>
                      registerAgain(
                        registration.event.id
                      )
                    }
                  >
                    Register Again
                  </button>
                )}

                {registration.status ===
                  "CHECKED_IN" && (
                  <div className="success-message">
                    ✅ Checked In
                  </div>
                )}
              </article>
            )
          )
        )}
      </div>
    </main>
  );
}

export default MyRegistrations;