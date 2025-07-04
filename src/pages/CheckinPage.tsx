import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Alert,
  Paper,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import axios from "axios";
import jsPDF from "jspdf";

interface BoardingPass {
  checkinId: string;
  bookingId: string;
  seatNumber: string;
  boardingPassNumber: string;
  checkinTime: string;
  firstName: string;
  lastName: string;
  passengerId: number;
}

const CheckinPage = () => {
  const [bookingId, setBookingId] = useState("");
  const [booking, setBooking] = useState(null);
  const [seats, setSeats] = useState([]);
  const [passengerSeats, setPassengerSeats] = useState({});
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [boardingPasses, setBoardingPasses] = useState<BoardingPass[]>([]);

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

  const handleSeatChange = (passengerId: string, seatNumber: string) => {
    setPassengerSeats((prev) => ({
      ...prev,
      [passengerId]: seatNumber,
    }));
  };

  const generateBoardingPass = (boardingPass: BoardingPass) => {
    const doc = new jsPDF();

    // Ajouter le titre
    doc.setFontSize(22);
    doc.text("Boarding Pass", 105, 20, { align: "center" });

    // Ajouter une ligne de séparation
    doc.setLineWidth(0.5);
    doc.line(20, 25, 190, 25);

    // Informations du passager
    doc.setFontSize(14);
    doc.text("Passenger Information", 20, 40);
    doc.setFontSize(12);
    doc.text(
      `Name: ${boardingPass.firstName} ${boardingPass.lastName}`,
      20,
      55
    );
    doc.text(`Seat: ${boardingPass.seatNumber}`, 20, 65);
    doc.text(
      `Boarding Pass #: ${boardingPass.boardingPassNumber}`,
      20,
      75
    );
    doc.text(
      `Check-in Time: ${new Date(boardingPass.checkinTime).toLocaleString()}`,
      20,
      85
    );
    doc.text(`Booking ID: ${boardingPass.bookingId}`, 20, 95);

    // QR Code simulation (juste un carré pour l'exemple)
    doc.rect(150, 40, 40, 40);
    doc.setFontSize(8);
    doc.text("Scan QR Code", 150, 90);

    // Footer
    doc.setFontSize(10);
    doc.text(
      "SkyReserve - Your Trusted Airline Partner",
      105,
      280,
      { align: "center" }
    );

    // Sauvegarder le PDF
    doc.save(`boarding-pass-${boardingPass.boardingPassNumber}.pdf`);
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

      const responses = await Promise.all(requests.filter(Boolean));
      const boardingPassesData = responses.map((response) => response.data);
      setBoardingPasses(boardingPassesData);
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
        <Box sx={{ mt: 3 }}>
          <Alert severity="success" sx={{ mb: 2 }}>
            ✅ Check-in effectué avec succès !
          </Alert>
          {boardingPasses.map((boardingPass) => (
            <Paper key={boardingPass.checkinId} sx={{ p: 2, mb: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: "bold" }}
                  >
                    {boardingPass.firstName} {boardingPass.lastName}
                  </Typography>
                  <Typography>
                    Siège: {boardingPass.seatNumber}
                  </Typography>
                  <Typography>
                    Boarding Pass #: {boardingPass.boardingPassNumber}
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<DownloadIcon />}
                  onClick={() => generateBoardingPass(boardingPass)}
                >
                  Télécharger
                </Button>
              </Box>
            </Paper>
          ))}
        </Box>
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
