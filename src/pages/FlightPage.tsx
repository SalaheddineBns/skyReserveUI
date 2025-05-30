import { useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  Container,
  Paper,
  Divider,
  Card,
  CardContent,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { useState } from "react";
import FlightTakeoff from "@mui/icons-material/FlightTakeoff";
import FlightLand from "@mui/icons-material/FlightLand";
import Event from "@mui/icons-material/Event";
import Euro from "@mui/icons-material/Euro";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Person from "@mui/icons-material/Person";
import LuggageIcon from "@mui/icons-material/Luggage";
import axios from "axios";

interface BaggageOption {
  type: "CABIN" | "SOUTE";
  quantity: number;
}

interface PassengerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  civilite: "Mr" | "Mme" | "Mlle";
  baggageOptions: BaggageOption[];
}

interface FlightData {
  flightId: number;
  departureCity: string;
  arrivalCity: string;
  departureDate: string;
  price: number;
  availableSeats: number;
}

interface BookingRequest {
  flightId: number;
  seats: number;
  passengers: PassengerInfo[];
}

const MAX_PASSENGERS = 3;
const MAX_CABIN_BAGGAGE = 1;
const MAX_SOUTE_BAGGAGE = 3;

const FlightPage = () => {
  const location = useLocation();
  const flightData = location.state?.flightData as FlightData;
  const [numberOfPassengers, setNumberOfPassengers] = useState(
    Math.min(location.state?.passengers || 1, MAX_PASSENGERS)
  );
  const [passengers, setPassengers] = useState<PassengerInfo[]>([
    {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      civilite: "Mr",
      baggageOptions: [],
    },
  ]);

  const handlePassengerChange = (
    index: number,
    field: keyof Omit<PassengerInfo, "baggageOptions">,
    value: string
  ) => {
    const newPassengers = [...passengers];
    newPassengers[index] = {
      ...newPassengers[index],
      [field]: value,
    };
    setPassengers(newPassengers);
  };

  const handleBaggageChange = (
    index: number,
    baggageType: "CABIN" | "SOUTE",
    value: number
  ) => {
    const newPassengers = [...passengers];
    const maxValue =
      baggageType === "CABIN" ? MAX_CABIN_BAGGAGE : MAX_SOUTE_BAGGAGE;
    const validValue = Math.min(Math.max(0, value), maxValue);

    const currentPassenger = { ...newPassengers[index] };
    const currentBaggageOptions = [...currentPassenger.baggageOptions];

    const existingBaggageIndex = currentBaggageOptions.findIndex(
      (option) => option.type === baggageType
    );

    if (validValue === 0 && existingBaggageIndex !== -1) {
      currentBaggageOptions.splice(existingBaggageIndex, 1);
    } else if (validValue > 0) {
      if (existingBaggageIndex !== -1) {
        currentBaggageOptions[existingBaggageIndex].quantity = validValue;
      } else {
        currentBaggageOptions.push({ type: baggageType, quantity: validValue });
      }
    }

    currentPassenger.baggageOptions = currentBaggageOptions;
    newPassengers[index] = currentPassenger;
    setPassengers(newPassengers);
  };

  const getBaggageQuantity = (
    passenger: PassengerInfo,
    type: "CABIN" | "SOUTE"
  ): number => {
    const baggageOption = passenger.baggageOptions.find(
      (option) => option.type === type
    );
    return baggageOption?.quantity || 0;
  };

  const updateNumberOfPassengers = (newNumber: number) => {
    const validNumber = Math.min(Math.max(1, newNumber), MAX_PASSENGERS);
    setNumberOfPassengers(validNumber);

    const newPassengers = [...passengers];
    if (validNumber > passengers.length) {
      // Add new passengers
      for (let i = passengers.length; i < validNumber; i++) {
        newPassengers.push({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          civilite: "Mr",
          baggageOptions: [],
        });
      }
    } else if (validNumber < passengers.length) {
      // Remove extra passengers
      newPassengers.splice(validNumber);
    }
    setPassengers(newPassengers);
  };

  const calculateTotalPrice = () => {
    return flightData.price * numberOfPassengers;
  };

  const handleReservation = async () => {
    const isAllPassengersInfoComplete = passengers
      .slice(0, numberOfPassengers)
      .every((p) => p.firstName && p.lastName && p.email && p.phone);

    if (!isAllPassengersInfoComplete) {
      alert("Veuillez remplir toutes les informations pour chaque passager");
      return;
    }

    const bookingRequest: BookingRequest = {
      flightId: flightData.flightId,
      seats: numberOfPassengers,
      passengers: passengers.slice(0, numberOfPassengers),
    };

    try {
      await axios.post("http://localhost:8083/api/bookings", bookingRequest);
      alert("Réservation effectuée avec succès!");
    } catch (error) {
      console.error("Erreur lors de la réservation:", error);
      alert("Erreur lors de la réservation");
    }
  };

  if (!flightData) {
    return (
      <Container maxWidth="md">
        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Typography variant="h5">Vol non trouvé</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{ textAlign: "center", mb: 4 }}
        >
          Détails du Vol
        </Typography>

        <Card elevation={3}>
          <CardContent>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {/* Vol Info Section */}
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  backgroundColor: "primary.light",
                  color: "white",
                  borderRadius: 2,
                }}
              >
                <Typography variant="h5" sx={{ textAlign: "center" }}>
                  Vol #{flightData.flightId}
                </Typography>
              </Paper>

              {/* Trajet */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  p: 2,
                }}
              >
                <Box sx={{ textAlign: "center" }}>
                  <FlightTakeoff sx={{ fontSize: 40, color: "primary.main" }} />
                  <Typography variant="h6">
                    {flightData.departureCity}
                  </Typography>
                </Box>

                <Divider orientation="horizontal" flexItem sx={{ mx: 2 }} />

                <Box sx={{ textAlign: "center" }}>
                  <FlightLand sx={{ fontSize: 40, color: "primary.main" }} />
                  <Typography variant="h6">{flightData.arrivalCity}</Typography>
                </Box>
              </Box>

              {/* Nombre de passagers */}
              <TextField
                fullWidth
                type="number"
                label="Nombre de passagers"
                value={numberOfPassengers}
                onChange={(e) =>
                  updateNumberOfPassengers(Number(e.target.value))
                }
                inputProps={{ min: 1, max: MAX_PASSENGERS }}
                helperText={`Maximum ${MAX_PASSENGERS} passagers`}
              />

              {/* Informations des passagers */}
              <Box sx={{ mt: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Informations des passagers
                </Typography>
                {passengers
                  .slice(0, numberOfPassengers)
                  .map((passenger, index) => (
                    <Accordion key={index} defaultExpanded={index === 0}>
                      <AccordionSummary expandIcon={<ExpandMore />}>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Person />
                          <Typography>
                            Passager {index + 1}
                            {passenger.firstName && passenger.lastName
                              ? ` - ${passenger.firstName} ${passenger.lastName}`
                              : ""}
                          </Typography>
                        </Box>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                              <InputLabel>Civilité</InputLabel>
                              <Select
                                value={passenger.civilite}
                                label="Civilité"
                                onChange={(e) =>
                                  handlePassengerChange(
                                    index,
                                    "civilite",
                                    e.target.value as "Mr" | "Mme" | "Mlle"
                                  )
                                }
                              >
                                <MenuItem value="Mr">Monsieur</MenuItem>
                                <MenuItem value="Mme">Madame</MenuItem>
                                <MenuItem value="Mlle">Mademoiselle</MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="Prénom"
                              value={passenger.firstName}
                              onChange={(e) =>
                                handlePassengerChange(
                                  index,
                                  "firstName",
                                  e.target.value
                                )
                              }
                              required
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="Nom"
                              value={passenger.lastName}
                              onChange={(e) =>
                                handlePassengerChange(
                                  index,
                                  "lastName",
                                  e.target.value
                                )
                              }
                              required
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="Email"
                              type="email"
                              value={passenger.email}
                              onChange={(e) =>
                                handlePassengerChange(
                                  index,
                                  "email",
                                  e.target.value
                                )
                              }
                              required
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="Téléphone"
                              value={passenger.phone}
                              onChange={(e) =>
                                handlePassengerChange(
                                  index,
                                  "phone",
                                  e.target.value
                                )
                              }
                              required
                            />
                          </Grid>

                          {/* Bagages du passager */}
                          <Grid item xs={12}>
                            <Box sx={{ mt: 2, mb: 1 }}>
                              <Typography
                                variant="subtitle1"
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                }}
                              >
                                <LuggageIcon />
                                Bagages
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              type="number"
                              label="Bagage cabine"
                              value={getBaggageQuantity(passengers[index], "CABIN")}
                              onChange={(e) =>
                                handleBaggageChange(index, "CABIN", Number(e.target.value))
                              }
                              inputProps={{ min: 0, max: MAX_CABIN_BAGGAGE }}
                              helperText={`Maximum ${MAX_CABIN_BAGGAGE} bagage cabine`}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              type="number"
                              label="Bagages en soute"
                              value={getBaggageQuantity(passengers[index], "SOUTE")}
                              onChange={(e) =>
                                handleBaggageChange(index, "SOUTE", Number(e.target.value))
                              }
                              inputProps={{ min: 0, max: MAX_SOUTE_BAGGAGE }}
                              helperText={`Maximum ${MAX_SOUTE_BAGGAGE} bagages en soute`}
                            />
                          </Grid>
                        </Grid>
                      </AccordionDetails>
                    </Accordion>
                  ))}
              </Box>

              {/* Prix et Réservation */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor: "grey.100",
                  p: 3,
                  borderRadius: 2,
                  mt: 2,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Euro color="primary" />
                  <Typography variant="h5">
                    {calculateTotalPrice()} € ({flightData.price} € ×{" "}
                    {numberOfPassengers} passagers)
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleReservation}
                  sx={{
                    minWidth: 200,
                    fontSize: "1.1rem",
                  }}
                >
                  Réserver
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default FlightPage;
