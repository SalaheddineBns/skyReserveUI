import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Divider,
  Button,
} from "@mui/material";
import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import axios from "axios";

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const booking = location.state?.booking;

  const [open, setOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePayment = async () => {
    setLoading(true);
    setError("");

    try {
      // Simuler un appel API pour le paiement
      const response = await axios.post(`http://localhost:8080/api/payments`, {
        bookingId: booking.bookingId,
      });
      console.log(response);
      if (response.data.status == "SUCCESS") {
        setSuccess(true);
        setTimeout(() => {
          // Rediriger vers la page de confirmation avec les détails de la réservation
          navigate("/confirmation", {
            state: {
              booking: {
                ...booking,
                status: "PAID",
                paymentDate: new Date().toISOString(),
              },
            },
          });
        }, 2000);
      } else {
        setError("Erreur lors du paiement. Veuillez réessayer.");
      }
    } catch (error) {
      console.error("Erreur de paiement:", error);
      setError("Erreur lors du paiement. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

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
            <b>Nombre de passagers:</b> {booking.passengers.length}
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
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 3 }}
            onClick={() => setOpen(true)}
          >
            Procéder au paiement
          </Button>

          <Dialog
            open={open}
            onClose={() => setOpen(false)}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle>Confirmer le paiement</DialogTitle>
            <DialogContent>
              <Typography sx={{ mb: 2 }}>
                Montant à payer : <strong>{booking.totalPrice} €</strong>
              </Typography>
              {error && (
                <Typography color="error" sx={{ mb: 2 }}>
                  {error}
                </Typography>
              )}
              {success && (
                <Typography color="success.main" sx={{ mb: 2 }}>
                  Paiement effectué avec succès ! Redirection en cours...
                </Typography>
              )}
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => setOpen(false)}
                disabled={loading || success}
              >
                Annuler
              </Button>
              <Button
                onClick={handlePayment}
                variant="contained"
                disabled={loading || success}
              >
                {loading ? "Traitement..." : "Confirmer le paiement"}
              </Button>
            </DialogActions>
          </Dialog>
        </CardContent>
      </Card>
    </Box>
  );
};

export default PaymentPage;
