import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Avatar,
  useTheme,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { useState } from "react";

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
}

interface User {
  username: string;
  isAdmin: boolean;
}

export const LoginModal = ({ open, onClose }: LoginModalProps) => {
  const theme = useTheme();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = () => {
    // Simuler une connexion - À remplacer par votre vraie logique d'authentification
    if (username === "admin" && password === "admin") {
      setUser({ username, isAdmin: true });
    } else {
      setUser({ username, isAdmin: false });
    }
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="login-modal-title">
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
        }}
      >
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: "grey.500",
          }}
        >
          <CloseIcon />
        </IconButton>

        {user ? (
          <Box sx={{ textAlign: "center" }}>
            <Avatar
              sx={{
                width: 64,
                height: 64,
                margin: "0 auto",
                bgcolor: user.isAdmin
                  ? theme.palette.primary.main
                  : theme.palette.secondary.main,
              }}
            >
              {username[0]?.toUpperCase()}
            </Avatar>
            <Typography variant="h6" sx={{ mt: 2 }}>
              {username}
            </Typography>
            <Typography color="text.secondary">
              {user.isAdmin ? "Administrateur" : "Utilisateur"}
            </Typography>
            <Button
              variant="outlined"
              onClick={() => setUser(null)}
              sx={{ mt: 2 }}
            >
              Se déconnecter
            </Button>
          </Box>
        ) : (
          <>
            <Typography
              id="login-modal-title"
              variant="h6"
              component="h2"
              sx={{ mb: 3 }}
            >
              Connexion
            </Typography>
            <Box
              component="form"
              sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            >
              <TextField
                label="Nom d'utilisateur"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                fullWidth
              />
              <TextField
                label="Mot de passe"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
              />
              <Button
                variant="contained"
                onClick={handleLogin}
                sx={{
                  mt: 2,
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                  "&:hover": {
                    background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                  },
                }}
              >
                Se connecter
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Modal>
  );
};
