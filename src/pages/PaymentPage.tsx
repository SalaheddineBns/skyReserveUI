import { useLocation } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Divider,
  Button,
} from "@mui/material";

const PaymentPage = () => {
  const location = useLocation();
  const booking = location.state?.booking;

  if (!booking) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="h5">Aucune réservation trouvée.</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f5f6fa",
      }}
    >
      <Card sx={{ minWidth: 400, p: 2 }}>
        <CardContent>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Paiement de la réservation
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography>
            <b>Réservation n°:</b> {booking.bookingId}
          </Typography>
          <Typography>
            <b>Vol n°:</b> {booking.flightId}
          </Typography>
          <Typography>
            <b>Nombre de passagers:</b> {booking.seats}
          </Typography>
          <Typography>
            <b>Nom:</b> {booking.firstName} {booking.lastName}
          </Typography>
          <Typography>
            <b>Email:</b> {booking.email}
          </Typography>
          <Typography>
            <b>Téléphone:</b> {booking.phone}
          </Typography>
          <Typography>
            <b>Civilité:</b> {booking.civility}
          </Typography>
          <Typography>
            <b>Date de réservation:</b> {booking.bookingDate}
          </Typography>
          <Typography>
            <b>Expiration:</b> {booking.expirationDate}
          </Typography>
          <Typography sx={{ mt: 2, fontWeight: "bold", color: "primary.main" }}>
            Total à payer : {booking.totalPrice} €
          </Typography>
          <Typography sx={{ mt: 1, color: "orange" }}>
            Statut : {booking.status}
          </Typography>
          <Button variant="contained" color="primary" fullWidth sx={{ mt: 3 }}>
            Procéder au paiement
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default PaymentPage;
