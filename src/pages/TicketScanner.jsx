import {
  useEffect,
  useState,
} from "react";

import {
  Html5QrcodeScanner,
} from "html5-qrcode";

import api from "../api/axios";

function TicketScanner() {
  const [qrToken, setQrToken] =
    useState("");

  const [ticket, setTicket] =
    useState(null);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  const [scannerKey, setScannerKey] =
    useState(0);

  useEffect(() => {
    const elementId =
      `qr-reader-${scannerKey}`;

    const scanner =
      new Html5QrcodeScanner(
        elementId,
        {
          fps: 10,
          qrbox: {
            width: 250,
            height: 250,
          },
        },
        false
      );

    scanner.render(
      (decodedText) => {
        setQrToken(decodedText);

        setMessage(
          "QR code detected."
        );

        scanner
          .clear()
          .catch(() => {});
      },
      () => {}
    );

    return () => {
      scanner
        .clear()
        .catch(() => {});
    };

  }, [scannerKey]);

  const verifyTicket = async () => {
    setError("");
    setMessage("");
    setTicket(null);

    if (!qrToken.trim()) {
      setError(
        "Scan or enter a QR token."
      );

      return;
    }

    try {
      const response =
        await api.post(
          "/api/tickets/verify",
          {
            qrToken:
              qrToken.trim(),
          }
        );

      setTicket(response.data);

      setMessage(
        "Valid ticket."
      );

    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Ticket verification failed."
      );
    }
  };

  const checkIn = async () => {
    setError("");
    setMessage("");

    try {
      const response =
        await api.post(
          "/api/tickets/check-in",
          {
            qrToken:
              qrToken.trim(),
          }
        );

      setTicket(response.data);

      setMessage(
        "Attendee checked in successfully."
      );

    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Check-in failed."
      );
    }
  };

  const resetScanner = () => {
    setQrToken("");
    setTicket(null);
    setMessage("");
    setError("");

    setScannerKey(
      (previous) =>
        previous + 1
    );
  };

  return (
    <main className="scanner-page">
      <div className="scanner-card">
        <div className="events-header">
          <span>Organizer</span>

          <h1>
            Ticket Check-In
          </h1>

          <p>
            Scan an EventFlow QR ticket
            or enter the QR token manually.
          </p>
        </div>

        <div
          id={`qr-reader-${scannerKey}`}
          className="qr-reader"
        />

        <div className="scanner-manual">
          <label>
            QR Token
          </label>

          <input
            value={qrToken}
            onChange={(e) =>
              setQrToken(
                e.target.value
              )
            }
            placeholder="QR token"
          />
        </div>

        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        {message && (
          <div className="success-message">
            {message}
          </div>
        )}

        {ticket && (
          <div className="ticket-result">
            <h3>
              {
                ticket.registration
                  ?.user?.name
              }
            </h3>

            <p>
              {
                ticket.registration
                  ?.event?.title
              }
            </p>

            <p>
              Ticket:{" "}
              {ticket.ticketNumber}
            </p>

            <p>
              Status:{" "}
              {ticket.status}
            </p>
          </div>
        )}

        <div className="scanner-actions">
          <button
            className="secondary-action-button"
            onClick={verifyTicket}
          >
            Verify Ticket
          </button>

          <button
            className="auth-button"
            onClick={checkIn}
            disabled={!qrToken}
          >
            Check In
          </button>

          <button
            className="danger-outline-button"
            onClick={resetScanner}
          >
            Scan Another
          </button>
        </div>
      </div>
    </main>
  );
}

export default TicketScanner;