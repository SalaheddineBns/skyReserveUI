import { createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
import FlightPage from "./pages/FlightPage";
import PaymentPage from "./pages/PaymentPage";

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
]);

export default router;
