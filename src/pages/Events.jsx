import {
  useEffect,
  useState,
} from "react";

import { Link } from "react-router-dom";

import api from "../api/axios";

function Events() {
  const [events, setEvents] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const response =
          await api.get(
            "/api/events"
          );

        setEvents(response.data);

      } catch {
        setError(
          "Unable to load events."
        );

      } finally {
        setLoading(false);
      }
    };

    loadEvents();

  }, []);

  if (loading) {
    return (
      <main className="events-page">
        <p>Loading events...</p>
      </main>
    );
  }

  return (
    <main className="events-page">
      <div className="events-header">
        <span>
          Upcoming Events
        </span>

        <h1>
          Discover your next experience
        </h1>

        <p>
          Explore upcoming events and
          reserve your seat.
        </p>
      </div>

      {error && (
        <div className="events-error">
          {error}
        </div>
      )}

      <div className="events-grid">
        {events.length === 0 ? (
          <p>
            No events available.
          </p>
        ) : (
          events.map((event) => (
            <article
              className="event-card"
              key={event.id}
            >
              <div className="event-card-top">
                <span className="event-category">
                  Event
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

                {event.organizer && (
                  <span>
                    👤 {event.organizer.name}
                  </span>
                )}
              </div>

              <Link
                to={`/events/${event.id}`}
                className="event-view-button"
              >
                View Details
              </Link>
            </article>
          ))
        )}
      </div>
    </main>
  );
}

export default Events;