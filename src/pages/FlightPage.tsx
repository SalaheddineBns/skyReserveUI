// src/pages/FlightPage.tsx
import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
  Paper,
  Grid,
  Divider,
  TextField,
  IconButton,
} from "@mui/material";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import FlightLandIcon from "@mui/icons-material/FlightLand";
import LuggageIcon from "@mui/icons-material/Luggage";
import EuroIcon from "@mui/icons-material/Euro";
import planeBg from "../assets/images/plane-bg.jpg";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const LOCAL_STORAGE_KEY = "flightPageForm";

const FlightPage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const flight = location.state?.flightData;
  const initialPassengers = location.state?.passengers || 1;
  const [numPassengers, setNumPassengers] = useState(initialPassengers);
  const [passengerDetails, setPassengerDetails] = useState(
    Array(initialPassengers).fill({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
    })
  );
  const [baggageOptions, setBaggageOptions] = useState(
    Array(initialPassengers).fill({ cabin: 0, soute: 0 })
  );

  // Chargement initial depuis le localStorage
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === "object") {
          if (parsed.numPassengers) setNumPassengers(parsed.numPassengers);
          if (parsed.passengerDetails)
            setPassengerDetails(parsed.passengerDetails);
          if (parsed.baggageOptions) setBaggageOptions(parsed.baggageOptions);
        }
      } catch {}
    }
  }, []);

  // Sauvegarde automatique à chaque modification
  useEffect(() => {
    localStorage.setItem(
      LOCAL_STORAGE_KEY,
      JSON.stringify({ numPassengers, passengerDetails, baggageOptions })
    );
  }, [numPassengers, passengerDetails, baggageOptions]);

  // Synchronise les tableaux si numPassengers change
  useEffect(() => {
    setPassengerDetails((prev) => {
      if (numPassengers > prev.length) {
        // Ajoute seulement les nouveaux passagers sans écraser les anciens
        return [
          ...prev,
          ...Array(numPassengers - prev.length).fill({
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
          }),
        ];
      } else {
        // Ne garde que les passagers nécessaires
        return prev.slice(0, numPassengers);
      }
    });
    setBaggageOptions((prev) => {
      if (numPassengers > prev.length) {
        // Ajoute seulement les nouveaux bagages sans écraser les anciens
        return [
          ...prev,
          ...Array(numPassengers - prev.length).fill({ cabin: 0, soute: 0 }),
        ];
      } else {
        // Ne garde que les bagages nécessaires
        return prev.slice(0, numPassengers);
      }
    });
  }, [numPassengers]);

  const handlePassengerChange = (
    index: number,
    field: string,
    value: string
  ) => {
    const updated = [...passengerDetails];
    updated[index] = { ...updated[index], [field]: value };
    setPassengerDetails(updated);
  };

  const handleBaggageChange = (
    index: number,
    type: "cabin" | "soute",
    value: number
  ) => {
    const updated = [...baggageOptions];
    updated[index][type] = value;
    setBaggageOptions(updated);
  };

  const totalPrice = () => {
    if (!flight) return 0;
    const flightPrice = flight.price * numPassengers;
    const baggagePrice = baggageOptions.reduce(
      (sum, bag) => sum + bag.cabin * 25 + bag.soute * 40,
      0
    );
    return flightPrice + baggagePrice;
  };

  // Nouvelle fonction pour gérer la réservation et la redirection
  const handleBooking = async () => {
    if (!flight) return;
    const bookingPayload = {
      flightId: flight.flightId,
      seats: numPassengers,
      passengers: passengerDetails.map((p, idx) => ({
        firstName: p.firstName,
        lastName: p.lastName,
        email: p.email,
        phone: p.phone,
        civilite: "Mr", // À adapter si tu veux demander la civilité
        baggageOptions: [
          ...(baggageOptions[idx].cabin > 0
            ? [{ type: "CABIN", quantity: baggageOptions[idx].cabin }]
            : []),
          ...(baggageOptions[idx].soute > 0
            ? [{ type: "SOUTE", quantity: baggageOptions[idx].soute }]
            : []),
        ],
      })),
    };
    try {
      const res = await axios.post(
        "http://localhost:8080/api/bookings",
        bookingPayload
      );
      const booking = res.data;
      console.log(booking);
      navigate(`/payment/${booking.bookingId}`, { state: { booking } });
    } catch (err) {
      alert("Erreur lors de la réservation. Veuillez réessayer.");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${planeBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        py: 5,
      }}
    >
      <Container maxWidth="md">
        {/* Affichage des détails du vol sélectionné */}
        {flight && (
          <Card
            elevation={4}
            sx={{
              mb: 4,
              background: "rgba(255,255,255,0.95)",
              borderRadius: 3,
            }}
          >
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Vol n° {flight.flightNumber}
              </Typography>
              <Typography>
                {flight.origin} → {flight.destination}
              </Typography>
              <Typography>Date : {flight.departureDate}</Typography>
              <Typography>Départ : {flight.departureTime}</Typography>
              <Typography>Arrivée : {flight.arrivalTime}</Typography>
              <Typography>
                Places disponibles : {flight.availableSeats}
              </Typography>
              <Typography sx={{ fontWeight: "bold", mt: 1 }}>
                Prix vol seul : {flight.price * numPassengers} €
              </Typography>
              <Typography
                sx={{ fontWeight: "bold", mt: 1, color: "primary.main" }}
              >
                Prix total (vol + bagages) : {totalPrice()} €
              </Typography>
            </CardContent>
          </Card>
        )}
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
          {["Détails du vol", "Bagages", "Récapitulatif"].map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Card
          elevation={5}
          sx={{
            background: "rgba(255,255,255,0.95)",
            backdropFilter: "blur(10px)",
            borderRadius: 3,
          }}
        >
          <CardContent>
            {/* Step 0: Détails du vol */}
            {activeStep === 0 && (
              <Box>
                <Typography variant="h5" sx={{ mb: 3 }}>
                  Détails du vol
                </Typography>
                <TextField
                  label="Nombre de passagers"
                  type="number"
                  value={numPassengers}
                  onChange={(e) => {
                    const value = Math.max(1, Math.min(3, +e.target.value));
                    setNumPassengers(value);
                  }}
                  fullWidth
                  sx={{ mb: 3 }}
                />
                {passengerDetails.map((passenger, index) => (
                  <Paper key={index} sx={{ p: 2, mb: 2 }}>
                    <Typography variant="subtitle1" sx={{ mb: 1 }}>
                      Passager {index + 1} : {passenger.firstName}{" "}
                      {passenger.lastName}
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Prénom"
                          fullWidth
                          value={passenger.firstName}
                          onChange={(e) =>
                            handlePassengerChange(
                              index,
                              "firstName",
                              e.target.value
                            )
                          }
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Nom"
                          fullWidth
                          value={passenger.lastName}
                          onChange={(e) =>
                            handlePassengerChange(
                              index,
                              "lastName",
                              e.target.value
                            )
                          }
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Email"
                          fullWidth
                          value={passenger.email}
                          onChange={(e) =>
                            handlePassengerChange(
                              index,
                              "email",
                              e.target.value
                            )
                          }
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Téléphone"
                          fullWidth
                          value={passenger.phone}
                          onChange={(e) =>
                            handlePassengerChange(
                              index,
                              "phone",
                              e.target.value
                            )
                          }
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                    </Grid>
                  </Paper>
                ))}
                <Button
                  variant="contained"
                  fullWidth
                  sx={{ mt: 3 }}
                  onClick={() => setActiveStep(1)}
                >
                  Suivant
                </Button>
              </Box>
            )}

            {/* Step 1: Bagages */}
            {activeStep === 1 && (
              <Box>
                <Typography variant="h5" sx={{ mb: 3 }}>
                  Bagages
                </Typography>
                {baggageOptions.map((bag, index) => (
                  <Paper key={index} sx={{ p: 2, mb: 2 }}>
                    <Typography variant="subtitle1" sx={{ mb: 1 }}>
                      {passengerDetails[index]?.firstName}{" "}
                      {passengerDetails[index]?.lastName}
                    </Typography>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} md={6}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            p: 2,
                            bgcolor: "background.default",
                            borderRadius: 1,
                          }}
                        >
                          <TextField
                            label="Bagage cabine"
                            type="number"
                            fullWidth
                            inputProps={{ min: 0, max: 1 }}
                            value={bag.cabin}
                            onChange={(e) =>
                              handleBaggageChange(
                                index,
                                "cabin",
                                Math.min(1, Math.max(0, +e.target.value))
                              )
                            }
                            InputLabelProps={{ shrink: true }}
                            sx={{
                              minWidth: "200px",
                              "& .MuiInputLabel-root": {
                                fontSize: "1rem",
                                whiteSpace: "nowrap",
                              },
                            }}
                          />
                          <Typography
                            variant="body1"
                            sx={{
                              whiteSpace: "nowrap",
                              minWidth: "60px",
                              fontWeight: "medium",
                            }}
                          >
                            (25€)
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            p: 2,
                            bgcolor: "background.default",
                            borderRadius: 1,
                          }}
                        >
                          <TextField
                            label="Bagages soute"
                            type="number"
                            fullWidth
                            inputProps={{ min: 0, max: 2 }}
                            value={bag.soute}
                            onChange={(e) =>
                              handleBaggageChange(
                                index,
                                "soute",
                                Math.min(2, Math.max(0, +e.target.value))
                              )
                            }
                            InputLabelProps={{ shrink: true }}
                            sx={{
                              minWidth: "200px",
                              "& .MuiInputLabel-root": {
                                fontSize: "1rem",
                                whiteSpace: "nowrap",
                              },
                            }}
                          />
                          <Typography
                            variant="body1"
                            sx={{
                              whiteSpace: "nowrap",
                              minWidth: "80px",
                              fontWeight: "medium",
                            }}
                          >
                            (40€/unité)
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Paper>
                ))}
                <Typography variant="h6" sx={{ mt: 2, textAlign: "right" }}>
                  Total: {totalPrice()} €
                </Typography>
                <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => setActiveStep(0)}
                  >
                    Précédent
                  </Button>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => setActiveStep(2)}
                  >
                    Suivant
                  </Button>
                </Box>
              </Box>
            )}

            {/* Step 2: Récapitulatif */}
            {activeStep === 2 && (
              <Box>
                <Typography variant="h5" sx={{ mb: 3 }}>
                  Récapitulatif
                </Typography>
                {passengerDetails.map((p, index) => (
                  <Paper key={index} sx={{ p: 2, mb: 2 }}>
                    <Typography>
                      {p.firstName} {p.lastName} - {p.email} - {p.phone}
                    </Typography>
                    <Typography>
                      Bagage cabine: {baggageOptions[index].cabin} (x25€),
                      Soute: {baggageOptions[index].soute} (x40€)
                    </Typography>
                  </Paper>
                ))}
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Total: {totalPrice()} €
                </Typography>
                <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => setActiveStep(1)}
                  >
                    Précédent
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleBooking}
                  >
                    Passer au paiement
                  </Button>
                </Box>
              </Box>
            )}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default FlightPage;
