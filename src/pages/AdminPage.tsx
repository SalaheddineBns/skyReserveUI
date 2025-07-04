import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  Button,
  TextField,
  IconButton,
  MenuItem,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminPage = () => {
  const [flights, setFlights] = useState([]);
  const [airlines, setAirlines] = useState<string[]>([]);
  const [flightDisplay, setFlightDisplay] = useState<any[]>([]);
  const [newFlight, setNewFlight] = useState({
    flightNumber: "",
    origin: "",
    destination: "",
    departureTime: "",
    arrivalTime: "",
    price: "",
    airline: "",
  });

  const navigate = useNavigate();
  const token = localStorage.getItem("adminToken");

  const api = axios.create({
    baseURL: "http://localhost:8080",
    headers: { Authorization: `Bearer ${token}` },
  });

  useEffect(() => {
    if (!token) {
      navigate("/");
    } else {
      fetchFlights();
      fetchAirlinesFromAircrafts();
    }
  }, []);

  const fetchFlights = async () => {
    try {
      const res = await api.get("/flights");
      const flights = res.data;
      setFlights(flights);

      const detailed = await Promise.all(
        flights.map(async (flight: any) => {
          try {
            const acRes = await axios.get(
              `http://localhost:8080/api/aircrafts/${flight.aircraftId}`
            );
            return {
              ...flight,
              airline: acRes.data.airline,
            };
          } catch (err) {
            return {
              ...flight,
              airline: "N/A",
            };
          }
        })
      );
      setFlightDisplay(detailed);
    } catch (error) {
      console.error("Erreur lors du chargement des vols", error);
    }
  };

  const fetchAirlinesFromAircrafts = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/aircrafts");
      const aircrafts = res.data;
      const airlineNames = Array.from(
        new Set(aircrafts.map((a: any) => a.airline))
      );
      setAirlines(airlineNames);
    } catch (error) {
      console.error("Erreur lors du chargement des compagnies", error);
    }
  };

  const handleAddFlight = async () => {
    try {
      const aircraftsRes = await axios.get(
        `http://localhost:8080/api/aircrafts/airline/${newFlight.airline}`
      );

      const availableAircraft = aircraftsRes.data.find(
        (ac: any) => ac.status === "actif"
      );

      if (!availableAircraft) {
        alert("Aucun avion actif trouvé pour cette compagnie.");
        return;
      }

      await api.post("/flights", {
        ...newFlight,
        price: parseFloat(newFlight.price),
        aircraftId: availableAircraft.id,
      });

      setNewFlight({
        flightNumber: "",
        origin: "",
        destination: "",
        departureTime: "",
        arrivalTime: "",
        price: "",
        airline: "",
      });

      fetchFlights();
    } catch (error) {
      console.error("Erreur lors de l'ajout du vol", error);
    }
  };

  const handleDeleteFlight = async (id: number) => {
    try {
      await api.delete(`/flights/${id}`);
      fetchFlights();
    } catch (error) {
      console.error("Erreur lors de la suppression du vol", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/");
  };

  return (
    <Box sx={{ p: 4 }}>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4">Panel Administrateur</Typography>
        <Button
          variant="outlined"
          color="error"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
        >
          Déconnexion
        </Button>
      </Box>

      {/* Tableau des vols */}
      <Typography variant="h5" gutterBottom>
        Gestion des vols
      </Typography>

      <TableContainer
        component={Paper}
        elevation={3}
        sx={{ borderRadius: 2, mb: 4 }}
      >
        <Table sx={{ minWidth: 800 }} aria-label="flight table">
          <TableHead sx={{ backgroundColor: "#1976d2" }}>
            <TableRow>
              <TableCell sx={{ color: "white" }}>ID</TableCell>
              <TableCell sx={{ color: "white" }}>Numéro</TableCell>
              <TableCell sx={{ color: "white" }}>Origine</TableCell>
              <TableCell sx={{ color: "white" }}>Destination</TableCell>
              <TableCell sx={{ color: "white" }}>Départ</TableCell>
              <TableCell sx={{ color: "white" }}>Arrivée</TableCell>
              <TableCell sx={{ color: "white" }}>Prix</TableCell>
              <TableCell sx={{ color: "white" }}>Compagnie</TableCell>
              <TableCell sx={{ color: "white" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {flightDisplay.map((flight: any) => (
              <TableRow
                key={flight.flightId}
                hover
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell>{flight.flightId}</TableCell>
                <TableCell>{flight.flightNumber}</TableCell>
                <TableCell>{flight.origin}</TableCell>
                <TableCell>{flight.destination}</TableCell>
                <TableCell>{flight.departureTime}</TableCell>
                <TableCell>{flight.arrivalTime}</TableCell>
                <TableCell>{flight.price} €</TableCell>
                <TableCell>{flight.airline}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => handleDeleteFlight(flight.flightId)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Formulaire d’ajout */}
      <Typography variant="h6" gutterBottom>
        Ajouter un nouveau vol
      </Typography>
      <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 2 }}>
        <TextField
          label="Numéro"
          value={newFlight.flightNumber}
          onChange={(e) =>
            setNewFlight({ ...newFlight, flightNumber: e.target.value })
          }
        />
        <TextField
          label="Origine"
          value={newFlight.origin}
          onChange={(e) =>
            setNewFlight({ ...newFlight, origin: e.target.value })
          }
        />
        <TextField
          label="Destination"
          value={newFlight.destination}
          onChange={(e) =>
            setNewFlight({ ...newFlight, destination: e.target.value })
          }
        />
        <TextField
          label="Départ (ex: 2025-07-07T10:00:00)"
          value={newFlight.departureTime}
          onChange={(e) =>
            setNewFlight({ ...newFlight, departureTime: e.target.value })
          }
        />
        <TextField
          label="Arrivée"
          value={newFlight.arrivalTime}
          onChange={(e) =>
            setNewFlight({ ...newFlight, arrivalTime: e.target.value })
          }
        />
        <TextField
          label="Prix"
          type="number"
          value={newFlight.price}
          onChange={(e) =>
            setNewFlight({ ...newFlight, price: e.target.value })
          }
        />
        <TextField
          label="Compagnie"
          select
          fullWidth
          value={newFlight.airline}
          onChange={(e) =>
            setNewFlight({ ...newFlight, airline: e.target.value })
          }
        >
          <MenuItem value="">Sélectionner une compagnie</MenuItem>
          {airlines.map((a) => (
            <MenuItem key={a} value={a}>
              {a}
            </MenuItem>
          ))}
        </TextField>
        <Button variant="contained" onClick={handleAddFlight}>
          Ajouter un vol
        </Button>
      </Box>
    </Box>
  );
};

export default AdminPage;
