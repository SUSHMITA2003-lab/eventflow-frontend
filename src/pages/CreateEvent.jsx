import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api/axios";

function CreateEvent() {
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
    useState(false);

  const updateField = (e) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.value,
    });
  };

  const submit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      await api.post(
        "/api/events",
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

      if (data?.message) {
        setError(data.message);
      } else if (data) {
        setError(
          Object.values(data).join(", ")
        );
      } else {
        setError(
          "Unable to create event."
        );
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-card wide-card">
        <div className="auth-header">
          <h1>Create Event</h1>

          <p>
            Publish a new event on EventFlow.
          </p>
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
              value={form.description}
              onChange={updateField}
              rows="4"
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

          <button
            className="auth-button"
            disabled={loading}
          >
            {loading
              ? "Creating..."
              : "Create Event"}
          </button>
        </form>
      </div>
    </main>
  );
}

export default CreateEvent;