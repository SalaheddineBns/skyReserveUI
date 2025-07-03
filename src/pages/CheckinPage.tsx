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
  const [selectedSeat, setSelectedSeat] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleFetchData = async () => {
    try {
      const bookingRes = await axios.get(
        `http://localhost:8080/api/bookings/${bookingId}`
      );
      setBooking(bookingRes.data);
      console.log(bookingRes);
      const seatRes = await axios.get("http://localhost:8080/api/inventory");
      const flightInventory = seatRes.data.find(
        (inv: any) => inv.flightId === bookingRes.data.flightId
      );

      const availableSeats = flightInventory.seats.filter(
        (seat: any) => seat.available
      );

      setSeats(availableSeats);
      setError("");
    } catch (err) {
      setError("Erreur de récupération des données.");
      setBooking(null);
      setSeats([]);
    }
  };

  const handleCheckin = async () => {
    try {
      await axios.post("http://localhost:8084/api/checkin", {
        bookingId: booking.bookingId,
        passengerId: booking.passengers?.[0]?.id ?? 1,
        seatNumber: selectedSeat,
      });
      setSuccess(true);
      setError("");
    } catch (err) {
      setError("Échec du check-in.");
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

          <TextField
            select
            label="Choisissez un siège"
            value={selectedSeat}
            onChange={(e) => setSelectedSeat(e.target.value)}
            fullWidth
            sx={{ mt: 2 }}
          >
            {seats.map((seat) => (
              <MenuItem key={seat.id} value={seat.seatNumber}>
                {seat.seatNumber}
              </MenuItem>
            ))}
          </TextField>

          <Button
            variant="contained"
            color="success"
            onClick={handleCheckin}
            sx={{ mt: 2 }}
            disabled={!selectedSeat}
          >
            Confirmer le check-in
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
