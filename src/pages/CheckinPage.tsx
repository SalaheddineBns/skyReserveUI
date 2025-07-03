import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Alert,
} from "@mui/material";
import axios from "axios";

const CheckinPage = () => {
  const [bookingId, setBookingId] = useState("");
  const [booking, setBooking] = useState(null);
  const [seats, setSeats] = useState([]);
  const [passengerSeats, setPassengerSeats] = useState({});
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleFetchData = async () => {
    try {
      const bookingRes = await axios.get(
        `http://localhost:8080/api/bookings/${bookingId}`
      );
      setBooking(bookingRes.data);

      const seatRes = await axios.get("http://localhost:8080/api/inventory");
      const flightInventory = seatRes.data.find(
        (inv) => inv.flightId === bookingRes.data.flightId
      );

      const availableSeats = flightInventory?.seats.filter(
        (seat) => seat.available
      );

      setSeats(availableSeats || []);
      setPassengerSeats({});
      setError("");
    } catch (err) {
      setError("Erreur de récupération des données.");
      setBooking(null);
      setSeats([]);
    }
  };

  const handleSeatChange = (passengerId, seatNumber) => {
    setPassengerSeats((prev) => ({
      ...prev,
      [passengerId]: seatNumber,
    }));
  };

  const handleCheckin = async () => {
    try {
      const requests = booking.passengers.map((passenger) => {
        const seatNumber = passengerSeats[passenger.passengerId];
        if (!seatNumber) return null;

        return axios.post("http://localhost:8080/api/checkin", {
          bookingId: booking.bookingId,
          passengerId: passenger.passengerId,
          seatNumber,
        });
      });

      await Promise.all(requests.filter(Boolean));

      setSuccess(true);
      setError("");
    } catch (err) {
      if (err.response && err.response.data) {
        const backendMessage =
          typeof err.response.data === "string"
            ? err.response.data
            : err.response.data.message || JSON.stringify(err.response.data);
        setError(backendMessage);
      } else {
        setError("Échec du check-in.");
      }
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Check-in
      </Typography>

      <TextField
        label="Booking ID"
        fullWidth
        value={bookingId}
        onChange={(e) => setBookingId(e.target.value)}
        sx={{ mb: 2 }}
      />
      <Button variant="contained" onClick={handleFetchData}>
        Rechercher
      </Button>

      {booking && (
        <>
          <Typography sx={{ mt: 3 }}>
            Réservation au nom de {booking.firstName} {booking.lastName}
          </Typography>

          {booking.passengers.map((passenger) => (
            <Box key={passenger.passengerId} sx={{ mt: 2 }}>
              <Typography>
                👤 {passenger.firstName} {passenger.lastName}
              </Typography>
              <TextField
                select
                label="Choisissez un siège"
                value={passengerSeats[passenger.passengerId] || ""}
                onChange={(e) =>
                  handleSeatChange(passenger.passengerId, e.target.value)
                }
                fullWidth
                sx={{ mt: 1 }}
              >
                {seats.map((seat) => (
                  <MenuItem key={seat.id} value={seat.seatNumber}>
                    {seat.seatNumber}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          ))}

          <Button
            variant="contained"
            color="success"
            onClick={handleCheckin}
            sx={{ mt: 3 }}
          >
            Confirmer le check-in pour tous
          </Button>
        </>
      )}

      {success && (
        <Alert severity="success" sx={{ mt: 3 }}>
          ✅ Check-in effectué avec succès !
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mt: 3 }}>
          {error}
        </Alert>
      )}
    </Box>
  );
};

export default CheckinPage;
