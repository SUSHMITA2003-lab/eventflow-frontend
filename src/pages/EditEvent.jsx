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

function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] =
    useState({
      title: "",
      description: "",
      location: "",
      eventDate: "",
      startTime: "",
      capacity: "",
    });

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const loadEvent = async () => {
      try {
        const response =
          await api.get(
            `/api/events/${id}`
          );

        const event =
          response.data;

        setForm({
          title:
            event.title || "",
          description:
            event.description || "",
          location:
            event.location || "",
          eventDate:
            event.eventDate || "",
          startTime:
            event.startTime || "",
          capacity:
            event.capacity || "",
        });

      } catch {
        setError(
          "Unable to load event."
        );

      } finally {
        setLoading(false);
      }
    };

    loadEvent();
  }, [id]);

  const updateField = (e) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.value,
    });
  };

  const submit = async (e) => {
    e.preventDefault();

    try {
      await api.put(
        `/api/events/${id}`,
        {
          ...form,
          capacity:
            Number(form.capacity),
        }
      );

      navigate("/organizer");

    } catch (error) {
      const data =
        error.response?.data;

      setError(
        data?.message ||
        (
          data
            ? Object.values(data)
                .join(", ")
            : "Unable to update event."
        )
      );
    }
  };

  if (loading) {
    return (
      <main className="auth-page">
        <p>Loading event...</p>
      </main>
    );
  }

  return (
    <main className="auth-page">
      <div className="auth-card wide-card">
        <Link
          to="/organizer"
          className="back-link"
        >
          ← Dashboard
        </Link>

        <div className="auth-header">
          <h1>Edit Event</h1>
        </div>

        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        <form
          className="auth-form"
          onSubmit={submit}
        >
          <div className="form-group">
            <label>Title</label>

            <input
              name="title"
              value={form.title}
              onChange={updateField}
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>

            <textarea
              name="description"
              rows="4"
              value={form.description}
              onChange={updateField}
            />
          </div>

          <div className="form-group">
            <label>Location</label>

            <input
              name="location"
              value={form.location}
              onChange={updateField}
              required
            />
          </div>

          <div className="form-group">
            <label>Date</label>

            <input
              type="date"
              name="eventDate"
              value={form.eventDate}
              onChange={updateField}
              required
            />
          </div>

          <div className="form-group">
            <label>Start Time</label>

            <input
              type="time"
              name="startTime"
              value={form.startTime}
              onChange={updateField}
              required
            />
          </div>

          <div className="form-group">
            <label>Capacity</label>

            <input
              type="number"
              name="capacity"
              min="1"
              value={form.capacity}
              onChange={updateField}
              required
            />
          </div>

          <button className="auth-button">
            Save Changes
          </button>
        </form>
      </div>
    </main>
  );
}

export default EditEvent;