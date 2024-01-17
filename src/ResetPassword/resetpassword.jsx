
import React, { useState } from 'react';
import axios from 'axios';
// import './resetpassword.css';
import {
  Box,
  Button,
  TextField,
  Typography,
} from "@mui/material";
import BASE_URL from '../config';

const ResetPassword = ({showForgotPasswordTitle }) => {
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [email, setEmail] = useState('');



    const handleResetPassword = async () => {
        try {
        const response = await axios.post(`${BASE_URL}/reset/`, {
            otp,
            new_password: newPassword,
            confirm_password: confirmPassword,
            email,
        });

        // Assuming your API returns a success status (e.g., HTTP 200 OK)
        if (response.status === 200) {
            console.log('Password reset successful');
            
            // Simulate redirection to the login page
            window.location.href = '/login'; // Replace with the actual path to your login page
        } else {
            console.error('Password reset failed');
        }
        } catch (error) {
        console.error('Password reset failed:', error);
        }
    };
    

  return (
    <Box>
      { showForgotPasswordTitle && <Typography variant='h5'>Reset Password </Typography>}
      {/* <Typography variant="h5">Reset Password</Typography> */}
      {/* {message && <div style={{ color: 'green' }}>{message}</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>} */}
      <TextField
        margin="normal"
        required
        fullWidth
        id="otp"
        label="OTP"
        name="otp"
        autoComplete="otp"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        autoFocus
      />
      <TextField
        margin="normal"
        required
        fullWidth
        id="password"
        label="New Password"
        name="password"
        autoComplete="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        id="confirmPassword"
        label="Confirm Password"
        name="confirmPassword"
        autoComplete="confirmPassword"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
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
        onClick={handleResetPassword}
      >
        Reset Password
      </Button>
    </Box>
  );
};

export default ResetPassword;