import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";

import MyRegistrations from "./pages/MyRegistrations";
import MyTickets from "./pages/MyTickets";

import OrganizerDashboard from "./pages/OrganizerDashboard";
import CreateEvent from "./pages/CreateEvent";
import EditEvent from "./pages/EditEvent";
import EventAttendees from "./pages/EventAttendees";
import TicketScanner from "./pages/TicketScanner";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/events"
          element={<Events />}
        />

        <Route
          path="/events/:id"
          element={<EventDetails />}
        />

        <Route
          path="/my-registrations"
          element={
            <ProtectedRoute
              allowedRoles={["USER"]}
            >
              <MyRegistrations />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-tickets"
          element={
            <ProtectedRoute
              allowedRoles={["USER"]}
            >
              <MyTickets />
            </ProtectedRoute>
          }
        />

        <Route
          path="/organizer"
          element={
            <ProtectedRoute
              allowedRoles={[
                "ORGANIZER",
              ]}
            >
              <OrganizerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/organizer/create-event"
          element={
            <ProtectedRoute
              allowedRoles={[
                "ORGANIZER",
              ]}
            >
              <CreateEvent />
            </ProtectedRoute>
          }
        />

        <Route
          path="/organizer/events/:id/edit"
          element={
            <ProtectedRoute
              allowedRoles={[
                "ORGANIZER",
              ]}
            >
              <EditEvent />
            </ProtectedRoute>
          }
        />

        <Route
          path="/organizer/events/:id/attendees"
          element={
            <ProtectedRoute
              allowedRoles={[
                "ORGANIZER",
              ]}
            >
              <EventAttendees />
            </ProtectedRoute>
          }
        />

        <Route
          path="/organizer/scan"
          element={
            <ProtectedRoute
              allowedRoles={[
                "ORGANIZER",
              ]}
            >
              <TicketScanner />
            </ProtectedRoute>
          }
        />

        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;