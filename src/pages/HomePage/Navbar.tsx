// src/components/Navbar.tsx

import { AppBar, Toolbar, Typography, IconButton, Button, Box } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

interface NavbarProps {
  onOpenLoginModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenLoginModal }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <AppBar
      position="fixed"
      color="transparent"
      sx={{ backdropFilter: "blur(8px)" }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography
          variant="h5"
          component="div"
          sx={{
            color: theme.palette.primary.main,
            fontWeight: "bold",
            textShadow: "1px 1px 2px rgba(0,0,0,0.1)",
            cursor: "pointer"
          }}
          onClick={() => navigate("/")}
        >
          SkyReserve
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Button
            variant="outlined"
            sx={{
              color: "white",
              borderColor: "white",
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                borderColor: 'white'
              }
            }}
            onClick={() => navigate("/checkin")}
          >
            Faire le check-in
          </Button>
          <IconButton
            size="large"
            onClick={onOpenLoginModal}
            sx={{
              color: theme.palette.primary.main,
              "&:hover": {
                background: "rgba(255,255,255,0.1)",
              },
            }}
          >
            <AccountCircleIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
