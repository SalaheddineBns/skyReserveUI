import { useState } from "react";
import { Box, Button, Container } from "@mui/material";
import Navbar from "./Navbar";
import { SearchFlightSection } from "./SearchFlightSection";
import { LoginModal } from "./LoginModal";
import planeBg from "../../assets/images/plane-bg.jpg";
import { useNavigate } from "react-router";

const HomePage = () => {
  const [openLoginModal, setOpenLoginModal] = useState(false);
  const navigate = useNavigate(); // pour la redirection

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Navbar */}
      <Navbar onOpenLoginModal={() => setOpenLoginModal(true)} />

      {/* Main Content with background */}
      <Box
        sx={{
          flexGrow: 1,
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url(${planeBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: 8,
        }}
      >
        <Container maxWidth="md">
          <SearchFlightSection />
          {/* ✅ Bouton Check-in ajouté ici */}
          <Button
            variant="contained"
            color="secondary"
            sx={{ mt: 4 }}
            onClick={() => navigate("/checkin")}
          >
            Faire le check-in
          </Button>
        </Container>
      </Box>

      {/* Login Modal */}
      <LoginModal
        open={openLoginModal}
        onClose={() => setOpenLoginModal(false)}
      />
    </Box>
  );
};

export default HomePage;
