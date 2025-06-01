// src/components/SearchFlight.tsx

import { useState, useEffect } from "react";
import {
  Box,
  TextField,
  MenuItem,
  Paper,
  Grid,
  Button,
  CircularProgress,
  Container,
  Card,
  CardContent,
  Typography,
  useTheme,
} from "@mui/material";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import FlightLandIcon from "@mui/icons-material/FlightLand";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PersonIcon from "@mui/icons-material/Person";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Flight {
  flightId: number;
  flightNumber: string;
  origin: string;
  destination: string;
  departureDate: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  availableSeats: number;
  aircraft?: string | null;
}

export const SearchFlightSection = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const [isLoading, setIsLoading] = useState(false);
  const [searchDone, setSearchDone] = useState(false);

  const [formData, setFormData] = useState({
    origin: "",
    arrivalCity: "",
    departureTime: "",
    departureDate: "",
    passengers: 1,
  });

  const [departureCities, setDepartureCities] = useState<string[]>([]);
  const [destinationCities, setDestinationCities] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<Flight[]>([]);

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const response = await axios.get<Flight[]>(
          "http://localhost:8080/flights"
        );
        const uniqueDepartures = [
          ...new Set(response.data.map((flight) => flight.origin)),
        ];
        const uniqueDestinations = [
          ...new Set(response.data.map((flight) => flight.destination)),
        ];

        setDepartureCities(uniqueDepartures);
        setDestinationCities(uniqueDestinations);
      } catch (error) {
        console.error("Error fetching flights:", error);
      }
    };

    fetchFlights();
  }, []);

  // Charger la dernière sélection depuis le localStorage au montage
  useEffect(() => {
    const savedFormData = localStorage.getItem("searchFormData");
    if (savedFormData) {
      setFormData(JSON.parse(savedFormData));
    }
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setSearchDone(false);
    // Sauvegarder la sélection dans le localStorage
    localStorage.setItem("searchFormData", JSON.stringify(formData));
    try {
      const response = await axios.get<Flight[]>(
        "http://localhost:8080/flights/search",
        {
          params: {
            origin: formData.origin,
            arrivalCity: formData.arrivalCity,
            departureTime: formData.departureTime || undefined,
            numberOfPassengers: formData.passengers || undefined,
          },
        }
      );
      console.log(response.data);
      setSearchResults(response.data || []);

      console.log(searchResults);

      setSearchDone(true);
    } catch (error) {
      setSearchResults([]);
      setSearchDone(true);
      console.error("Error searching flights:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ width: "100%", px: 3 }}>
      <Card
        elevation={5}
        sx={{
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ mb: 5, textAlign: "center" }}>
            <Typography
              variant="h3"
              component="h1"
              sx={{
                color: theme.palette.primary.main,
                fontWeight: "bold",
                mb: 2,
                textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              Trouvez votre vol idéal
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{
                maxWidth: "600px",
                margin: "0 auto",
                lineHeight: 1.6,
              }}
            >
              Réservez votre prochain vol en quelques clics et voyagez en toute
              sérénité
            </Typography>
          </Box>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 3 }}
          >
            <Grid container spacing={3}>
              {/* Ligne 1: Départ + Destination */}
              <Grid item xs={12} md={6}>
                <Paper elevation={2} sx={paperStyle}>
                  <FlightTakeoffIcon sx={iconStyle} />
                  <TextField
                    fullWidth
                    select
                    label="Ville de départ"
                    name="origin"
                    value={formData.origin}
                    onChange={handleChange}
                    required
                    sx={{
                      "& label": {
                        whiteSpace: "normal",
                        overflow: "visible",
                        textOverflow: "clip",
                      },
                    }}
                  >
                    {departureCities.map((city) => (
                      <MenuItem key={city} value={city}>
                        {city}
                      </MenuItem>
                    ))}
                  </TextField>
                </Paper>
              </Grid>

              <Grid item xs={12} md={6}>
                <Paper elevation={2} sx={paperStyle}>
                  <FlightLandIcon sx={iconStyle} />
                  <TextField
                    fullWidth
                    select
                    label="Ville d'arrivé"
                    name="destination"
                    value={formData.arrivalCity}
                    onChange={handleChange}
                  >
                    {destinationCities.map((city) => (
                      <MenuItem key={city} value={city}>
                        {city}
                      </MenuItem>
                    ))}
                  </TextField>
                </Paper>
              </Grid>
            </Grid>
            <Grid container spacing={3}>
              {/* Ligne 2: Date + Passagers */}
              <Grid item xs={12} md={6}>
                <Paper elevation={2} sx={paperStyle}>
                  <CalendarTodayIcon sx={iconStyle} />
                  <TextField
                    fullWidth
                    label="Date de départ"
                    name="departureTime"
                    type="date"
                    value={formData.departureTime}
                    onChange={handleChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Paper>
              </Grid>

              <Grid item xs={12} md={6}>
                <Paper elevation={2} sx={paperStyle}>
                  <PersonIcon sx={iconStyle} />
                  <TextField
                    fullWidth
                    select
                    label="Nombre de passagers"
                    name="passengers"
                    value={formData.passengers}
                    onChange={handleChange}
                    required
                  >
                    {[1, 2, 3].map((num) => (
                      <MenuItem key={num} value={num}>
                        {num} {num === 1 ? "passager" : "passagers"}
                      </MenuItem>
                    ))}
                  </TextField>
                </Paper>
              </Grid>
            </Grid>

            <Button
              variant="contained"
              type="submit"
              size="large"
              disabled={isLoading}
              sx={{ mt: 3 }}
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Rechercher un vol"
              )}
            </Button>
          </Box>
          {/* Résultats de recherche */}
          {searchDone && (
            <Box sx={{ mt: 5 }}>
              {searchResults.length === 0 ? (
                <Typography color="error" align="center">
                  Aucun vol trouvé.
                </Typography>
              ) : (
                <Grid container spacing={3}>
                  {searchResults.map((flight) => (
                    <Grid item xs={12} key={flight.flightId}>
                      <Paper
                        elevation={3}
                        sx={{
                          p: 3,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          mb: 2,
                        }}
                      >
                        <Box>
                          <Typography
                            variant="subtitle1"
                            sx={{ fontWeight: "bold" }}
                          >
                            Vol n° {flight.flightNumber}
                          </Typography>
                          <Typography>
                            {flight.origin} → {flight.destination}
                          </Typography>
                          <Typography>Date : {flight.departureDate}</Typography>
                          <Typography>
                            Départ : {flight.departureTime}
                          </Typography>
                          <Typography>
                            Arrivée : {flight.arrivalTime}
                          </Typography>
                          <Typography>
                            Places disponibles : {flight.availableSeats}
                          </Typography>
                          <Typography sx={{ fontWeight: "bold", mt: 1 }}>
                            Prix : {flight.price * formData.passengers} €
                          </Typography>
                        </Box>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() =>
                            navigate(`/flights/${flight.flightId}`, {
                              state: {
                                flightData: flight,
                                passengers: formData.passengers,
                              },
                            })
                          }
                        >
                          Choisir
                        </Button>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

const paperStyle = {
  p: 2.5,
  display: "flex",
  alignItems: "center",
  gap: 2,
  width: "100%", // 💡 Important pour forcer le conteneur à s'élargir
  maxWidth: "100%", // Pour éviter tout overflow caché
  transition: "transform 0.2s",
  "&:hover": { transform: "translateY(-2px)" },
};

const iconStyle = { fontSize: 28, color: "primary.main" };
