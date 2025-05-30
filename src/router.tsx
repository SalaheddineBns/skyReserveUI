import { createBrowserRouter } from 'react-router-dom';
import HomePage from './pages/HomePage';
import FlightPage from './pages/FlightPage';

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/flights/:flightId",
    element: <FlightPage />,
  }
]);

export default router;