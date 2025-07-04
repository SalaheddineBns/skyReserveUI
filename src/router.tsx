import { createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
import FlightPage from "./pages/FlightPage";
import PaymentPage from "./pages/PaymentPage";
import ConfirmationPage from "./pages/ConfirmationPage";
import CheckinPage from "./pages/CheckinPage";
import AdminPage from "./pages/AdminPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/flights/:flightId",
    element: <FlightPage />,
  },
  {
    path: "/payment/:bookingId",
    element: <PaymentPage />,
  },
  {
    path: "/confirmation", // ← manquante jusqu'ici
    element: <ConfirmationPage />,
  },
  {
    path: "/admin", // ✅ Ajoute cette ligne
    element: <AdminPage />,
  },
]);

export default router;
