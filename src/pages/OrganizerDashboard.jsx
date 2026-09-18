import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import api from "../api/axios";

function OrganizerDashboard() {
  const navigate = useNavigate();

  const [events, setEvents] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const loadEvents = async () => {
    const email =
      localStorage.getItem("email");

    try {
      const response =
        await api.get(
          "/api/events"
        );

      const mine =
        response.data.filter(
          (event) =>
            event.organizer?.email ===
            email
        );

      setEvents(mine);

    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Unable to load events."
      );

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const deleteEvent = async (
    eventId
  ) => {
    if (
      !window.confirm(
        "Delete this event?"
      )
    ) {
      return;
    }

    try {
      await api.delete(
        `/api/events/${eventId}`
      );

      setEvents((previous) =>
        previous.filter(
          (event) =>
            event.id !== eventId
        )
      );

    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Unable to delete event."
      );
    }
  };

  const totalCapacity =
    events.reduce(
      (sum, event) =>
        sum + event.capacity,
      0
    );

  const totalAvailable =
    events.reduce(
      (sum, event) =>
        sum + event.availableSeats,
      0
    );

  if (loading) {
    return (
      <main className="events-page">
        <p>Loading dashboard...</p>
      </main>
    );
  }

  return (
    <main className="events-page">
      <div className="organizer-header">
        <div className="events-header">
          <span>Organizer</span>

          <h1>
            Organizer Dashboard
          </h1>

          <p>
            Manage events, attendees
            and ticket check-ins.
          </p>
        </div>

        <div className="top-actions">
          <Link
            to="/organizer/scan"
            className="secondary-action-button"
          >
            Scan Ticket
          </Link>

          <Link
            to="/organizer/create-event"
            className="create-event-button"
          >
            + Create Event
          </Link>
        </div>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <strong>
            {events.length}
          </strong>
          <span>Total Events</span>
        </div>

        <div className="stat-card">
          <strong>
            {totalCapacity}
          </strong>
          <span>Total Capacity</span>
        </div>

        <div className="stat-card">
          <strong>
            {totalAvailable}
          </strong>
          <span>Available Seats</span>
        </div>
      </div>

      {error && (
        <div className="events-error">
          {error}
        </div>
      )}

      <div className="events-grid">
        {events.length === 0 ? (
          <p>
            You have not created
            any events yet.
          </p>
        ) : (
          events.map((event) => (
            <article
              className="event-card"
              key={event.id}
            >
              <div className="event-card-top">
                <span className="event-category">
                  Event #{event.id}
                </span>

                <span className="event-seats">
                  {event.availableSeats}
                  {" seats left"}
                </span>
              </div>

              <h2>
                {event.title}
              </h2>

              <p className="event-description">
                {event.description}
              </p>

              <div className="event-details">
                <span>
                  📍 {event.location}
                </span>

                <span>
                  📅 {event.eventDate}
                </span>

                <span>
                  🕐 {event.startTime}
                </span>

                <span>
                  👥 {event.capacity}
                  {" capacity"}
                </span>
              </div>

              <div className="card-actions">
                <Link
                  to={`/organizer/events/${event.id}/attendees`}
                  className="event-view-button"
                >
                  View Attendees
                </Link>

                <Link
                  to={`/organizer/events/${event.id}/edit`}
                  className="secondary-action-button full-width"
                >
                  Edit Event
                </Link>

                <button
                  className="danger-outline-button"
                  onClick={() =>
                    deleteEvent(
                      event.id
                    )
                  }
                >
                  Delete Event
                </button>
              </div>
            </article>
          ))
        )}
      </div>
    </main>
  );
}

export default OrganizerDashboard;