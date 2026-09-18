import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useParams,
} from "react-router-dom";

import api from "../api/axios";

function EventAttendees() {
  const { id } = useParams();

  const [attendees, setAttendees] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const response =
          await api.get(
            `/api/registrations/event/${id}`
          );

        setAttendees(
          response.data
        );

      } catch (error) {
        setError(
          error.response?.data?.message ||
          "Unable to load attendees."
        );

      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  if (loading) {
    return (
      <main className="events-page">
        <p>Loading attendees...</p>
      </main>
    );
  }

  return (
    <main className="events-page">
      <Link
        to="/organizer"
        className="back-link"
      >
        ← Back to Dashboard
      </Link>

      <div className="events-header">
        <span>Organizer</span>

        <h1>
          Event Attendees
        </h1>

        <p>
          View active registrations
          for this event.
        </p>
      </div>

      {error && (
        <div className="events-error">
          {error}
        </div>
      )}

      <div className="events-grid">
        {attendees.length === 0 ? (
          <p>
            No attendees registered yet.
          </p>
        ) : (
          attendees.map(
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
                    {
                      registration.status
                    }
                  </span>
                </div>

                <h2>
                  {
                    registration.user
                      ?.name
                  }
                </h2>

                <div className="event-details">
                  <span>
                    📧{" "}
                    {
                      registration.user
                        ?.email
                    }
                  </span>

                  <span>
                    🎟{" "}
                    {
                      registration.status
                    }
                  </span>

                  <span>
                    🗓{" "}
                    {
                      registration.registrationDate
                    }
                  </span>
                </div>
              </article>
            )
          )
        )}
      </div>
    </main>
  );
}

export default EventAttendees;