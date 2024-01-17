import React, { useState } from "react";
import axios from "axios";
import {
  Avatar,
  Box,
  Button,
  Container,
  CssBaseline,
  Grid,
  Link,
  TextField,
  Typography,
  ThemeProvider,
} from "@mui/material";
// import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import ResetPassword from "../ResetPassword/resetpassword";
// import { defaultTheme } from "./yourTheme"; // Import your theme from the correct location
import BASE_URL from "../config";

const ForgotPassword = ({ onResetPassword }) => {
  const [email, setEmail] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showResetPassword, setShowResetPassword] = useState(false);


const handleForgotPassword = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/forgot/`, {
        email: email,
      });

      // Handle successful response
      setSuccessMessage(response.data.message);
      setErrorMessage("");
      setShowResetPassword(true); // Show the ResetPassword component
    } catch (error) {
      setSuccessMessage("");
      setErrorMessage(error.response?.data?.error || "Password reset failed");
      setShowResetPassword(false); // Hide the ResetPassword component
    }
  };

  return (
    <Box>
      {!showResetPassword ? (
        <>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoFocus
          />
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleForgotPassword}
          >
           Sent OTP
          </Button>
        </>
      ) : (
        <ResetPassword showForgotPasswordTitle={true}/>
      )}
    </Box>
   
  );
};
export default ForgotPassword;