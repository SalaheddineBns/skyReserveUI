import { Box, Typography, Button } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";

const ConfirmationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // On suppose que les infos de réservation sont passées via state
  const booking = location.state?.booking;

  return (
    <Box sx={{ mt: 8, textAlign: "center" }}>
      <Typography variant="h4" color="primary" gutterBottom>
        Réservation réalisée avec succès !
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        Vous pouvez télécharger votre récapitulatif et vérifier votre
        réservation dans votre espace personnel.
      </Typography>
      {booking && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6">Détails de la réservation :</Typography>
          <Typography>Numéro de réservation : {booking.bookingId}</Typography>
          <Typography>Montant payé : {booking.totalPrice} €</Typography>
          {/* Ajoute d'autres infos si besoin */}
        </Box>
      )}
      <Button variant="contained" onClick={() => navigate("/")}>
        Retour à l'accueil
      </Button>
    </Box>
  );
};

export default ConfirmationPage;
