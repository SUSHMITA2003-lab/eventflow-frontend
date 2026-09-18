import {
  useEffect,
  useState,
} from "react";

import api from "../api/axios";

function MyTickets() {
  const [tickets, setTickets] =
    useState([]);

  const [qrImages, setQrImages] =
    useState({});

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const loadTickets = async () => {
      try {
        const response =
          await api.get(
            "/api/tickets/my"
          );

        setTickets(response.data);

      } catch (error) {
        setError(
          error.response?.data?.message ||
          "Unable to load tickets."
        );

      } finally {
        setLoading(false);
      }
    };

    loadTickets();
  }, []);

  const viewQr = async (
    ticketId
  ) => {
    try {
      const response =
        await api.get(
          `/api/tickets/${ticketId}/qr`,
          {
            responseType: "blob",
          }
        );

      const imageUrl =
        URL.createObjectURL(
          response.data
        );

      setQrImages((previous) => ({
        ...previous,
        [ticketId]: imageUrl,
      }));

    } catch {
      alert(
        "QR code is not available for this ticket."
      );
    }
  };

  if (loading) {
    return (
      <main className="events-page">
        <p>Loading tickets...</p>
      </main>
    );
  }

  return (
    <main className="events-page">
      <div className="events-header">
        <span>My Tickets</span>

        <h1>
          Your Event Tickets
        </h1>

        <p>
          Access your secure QR tickets.
        </p>
      </div>

      {error && (
        <div className="events-error">
          {error}
        </div>
      )}

      <div className="events-grid">
        {tickets.length === 0 ? (
          <p>
            You do not have any tickets.
          </p>
        ) : (
          tickets.map((ticket) => (
            <article
              className="event-card"
              key={ticket.id}
            >
              <div className="event-card-top">
                <span className="event-category">
                  {ticket.ticketNumber}
                </span>

                <span className="status-badge">
                  {ticket.status}
                </span>
              </div>

              <h2>
                {
                  ticket.registration
                    ?.event?.title
                }
              </h2>

              <div className="event-details">
                <span>
                  📍{" "}
                  {
                    ticket.registration
                      ?.event?.location
                  }
                </span>

                <span>
                  📅{" "}
                  {
                    ticket.registration
                      ?.event?.eventDate
                  }
                </span>

                <span>
                  🕐{" "}
                  {
                    ticket.registration
                      ?.event?.startTime
                  }
                </span>
              </div>

              {ticket.status === "VALID" && (
                <>
                  <button
                    className="event-view-button"
                    onClick={() =>
                      viewQr(ticket.id)
                    }
                  >
                    View QR Code
                  </button>

                  {qrImages[ticket.id] && (
                    <div className="ticket-qr">
                      <img
                        src={
                          qrImages[
                            ticket.id
                          ]
                        }
                        alt="Ticket QR"
                      />

                      <p>
                        Show this QR code
                        at the entrance.
                      </p>
                    </div>
                  )}
                </>
              )}

              {ticket.status === "USED" && (
                <div className="success-message">
                  ✅ Ticket Checked In
                </div>
              )}
            </article>
          ))
        )}
      </div>
    </main>
  );
}

export default MyTickets;