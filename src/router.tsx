import { createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
import FlightPage from "./pages/FlightPage";
import PaymentPage from "./pages/PaymentPage";
import ConfirmationPage from "./pages/ConfirmationPage";
import CheckinPage from "./pages/CheckinPage";

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
    path: "/checkin",
    element: <CheckinPage />,
  },
]);

export default router;
