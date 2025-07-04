import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import jsPDF from "jspdf";

const ConfirmationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const booking = location.state?.booking;

  const generatePDF = () => {
    if (!booking) return;

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Confirmation de Réservation", 20, 20);
    doc.setFontSize(12);
    doc.text(`Numéro de réservation : ${booking.bookingId}`, 20, 40);
    doc.text(`Montant payé : ${booking.totalPrice} €`, 20, 50);
    // Ajoute d'autres champs si dispo, ex:
    // doc.text(`Vol : ${booking.flightNumber}`, 20, 60);

    doc.save(`reservation_${booking.bookingId}.pdf`);
  };

  return (
    <Box sx={{ mt: 10, textAlign: "center", px: 2 }}>
      <Typography variant="h4" color="primary" gutterBottom>
        ✅ Réservation réussie !
      </Typography>

      <Typography variant="body1" sx={{ mb: 4 }}>
        Vous pouvez télécharger votre récapitulatif ou retourner à l'accueil.
      </Typography>

      {booking && (
        <Card sx={{ maxWidth: 500, mx: "auto", mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              ✈️ Détails de la réservation
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography>
              <strong>Numéro :</strong> {booking.bookingId}
            </Typography>
            <Typography>
              <strong>Montant :</strong> {booking.totalPrice} €
            </Typography>
            {/* Ajouter d'autres infos ici si disponibles */}
          </CardContent>
        </Card>
      )}

      <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
        <Button variant="outlined" color="primary" onClick={generatePDF}>
          Télécharger le PDF
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/")}
        >
          Retour à l'accueil
        </Button>
      </Box>
    </Box>
  );
};

export default ConfirmationPage;
