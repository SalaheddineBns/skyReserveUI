import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  MenuItem,
  Container,
  Button,
  CircularProgress,
} from "@mui/material";
import axios from "axios";

interface Flight {
  flightId: number;
  flightNumber: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
}

const HomePage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    origin: "",
    destination: "",
    departureTime: "",
    passengers: 1,
  });

  const [flights, setFlights] = useState<Flight[]>([]);
  const [departureCities, setDepartureCities] = useState<string[]>([]);
  const [destinationCities, setDestinationCities] = useState<string[]>([]);

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const response = await axios.get<Flight[]>(
          "http://localhost:8080/flights"
        );
        setFlights(response.data);

        // Extract unique departure and destination cities
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
    try {
      const response = await axios.get<Flight[]>(
        "http://localhost:8080/flights/search",
        {
          params: {
            origin: formData.origin,
            destination: formData.destination,
            departureTime: formData.departureTime || undefined,
            numberOfPassengers: formData.passengers || undefined,
          },
        }
      );

      if (response.data && response.data.length > 0) {
        navigate(`/flights/${response.data[0].flightId}`, {
          state: {
            flightData: response.data[0],
            passengers: formData.passengers,
          },
        });
      } else {
        console.error("Aucun vol trouvé");
      }
    } catch (error) {
      console.error("Error searching flights:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          mt: 4,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <TextField
          fullWidth
          select
          label="Ville de départ"
          name="origin"
          value={formData.origin}
          onChange={handleChange}
          required
        >
          {departureCities.map((city) => (
            <MenuItem key={city} value={city}>
              {city}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          fullWidth
          select
          label="Ville d'arrivée"
          name="destination"
          value={formData.destination}
          onChange={handleChange}
          required
        >
          {destinationCities.map((city) => (
            <MenuItem key={city} value={city}>
              {city}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          fullWidth
          label="Date et heure de départ"
          name="departureTime"
          type="datetime-local"
          value={formData.departureTime}
          onChange={handleChange}
          InputLabelProps={{
            shrink: true,
          }}
        />

        <TextField
          fullWidth
          select
          label="Nombre de passagers"
          name="passengers"
          value={formData.passengers}
          onChange={handleChange}
          required
        >
          {[1, 2, 3, 4, 5, 6].map((num) => (
            <MenuItem key={num} value={num}>
              {num}
            </MenuItem>
          ))}
        </TextField>

        <Button
          variant="contained"
          type="submit"
          sx={{ mt: 2 }}
          disabled={isLoading}
        >
          {isLoading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Rechercher"
          )}
        </Button>
      </Box>
    </Container>
  );
};

export default HomePage;
