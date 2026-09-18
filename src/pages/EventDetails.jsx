import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import api from "../api/axios";

function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [message, setMessage] =
    useState("");

  const loadEvent = async () => {
    try {
      const response =
        await api.get(
          `/api/events/${id}`
        );

      setEvent(response.data);

    } catch {
      setMessage(
        "Unable to load event."
      );

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvent();
  }, [id]);

  const handleRegister = async () => {
    const token =
      localStorage.getItem("token");

    const role =
      localStorage.getItem("role");

    if (!token) {
      navigate("/login");
      return;
    }

    if (role !== "USER") {
      setMessage(
        "Organizer accounts cannot register for events."
      );
      return;
    }

    try {
      const response =
        await api.post(
          `/api/registrations/events/${id}`
        );

      setMessage(
        `Registration successful: ${response.data.status}`
      );

      await loadEvent();

    } catch (error) {
      setMessage(
        error.response?.data?.message ||
        "Unable to register."
      );
    }
  };

  if (loading) {
    return (
      <main className="event-details-page">
        <p>Loading event...</p>
      </main>
    );
  }

  if (!event) {
    return (
      <main className="event-details-page">
        <p>{message}</p>
      </main>
    );
  }

  return (
    <main className="event-details-page">
      <Link
        to="/events"
        className="back-link"
      >
        ← Back to Events
      </Link>

      <div className="event-details-card">
        <span className="event-category">
          Upcoming Event
        </span>

        <h1>
          {event.title}
        </h1>

        <p className="event-full-description">
          {event.description}
        </p>

        <div className="event-details-info">
          <div>
            <strong>Location</strong>
            <span>
              {event.location}
            </span>
          </div>

          <div>
            <strong>Date</strong>
            <span>
              {event.eventDate}
            </span>
          </div>

          <div>
            <strong>Time</strong>
            <span>
              {event.startTime}
            </span>
          </div>

          <div>
            <strong>
              Available Seats
            </strong>

            <span>
              {event.availableSeats}
              {" / "}
              {event.capacity}
            </span>
          </div>
        </div>

        {message && (
          <div className="info-message">
            {message}
          </div>
        )}

        {localStorage.getItem("role")
          !== "ORGANIZER" && (
          <button
            className="register-event-button"
            onClick={handleRegister}
            disabled={
              event.availableSeats <= 0
            }
          >
            {event.availableSeats <= 0
              ? "Event Full"
              : "Register for Event"}
          </button>
        )}
      </div>
    </main>
  );
}

export default EventDetails;