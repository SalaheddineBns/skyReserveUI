// src/components/Navbar.tsx

import { AppBar, Toolbar, Typography, IconButton } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useTheme } from "@mui/material/styles";

interface NavbarProps {
  onOpenLoginModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenLoginModal }) => {
  const theme = useTheme();

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
          }}
        >
          SkyReserve
        </Typography>
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
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
