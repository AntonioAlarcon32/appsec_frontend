import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Grid, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axiosInstance from './AxiosInstace.js'; 

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const navigate = useNavigate();
  const [error, setError] = useState(''); // State to store error message
  const [emailError, setEmailError] = useState(false);
  
  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
    setError(''); // Clear general error message

    if (event.target.name === 'email') {
      setEmailError(!validateEmail(event.target.value)); // Validate email format
    }
  };

  const validateEmail = (email) => {
    // Simple email validation pattern
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axiosInstance.post('/user/register', formData);
      console.log(response)
      // Validate response (this depends on your backend's response structure)
      if (response.data && response.status === 201) {
        navigate('/');
      } 

      else {
        // Handle invalid response
        setError('Registration failed. Please try again.');
      }
    } catch (error) {
      console.log(error.response.status)
      // Handle different types of errors
      if (error.response) {
        // The server responded with a status code outside the 2xx range
        if (error.response.status === 400) {
          setError("User already in use, please login instead")
        }
        else {
          setError(error.response.data.message || 'An error occurred on the server. Please try again');
        }
        
      } else if (error.request) {
        // The request was made but no response was received
        setError('No response was received from the server.');
      } else {
        // Something else caused the error
        setError('An error occurred during registration.');
      }
      console.error('Registration error:', error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h3" gutterBottom>
          Register
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Username"
                name="username"
                autoComplete="username"
                autoFocus
                value={formData.username}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Email Address"
                name="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                error={emailError}
                helperText={emailError && "Please enter a valid email address"}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
          {error && <Typography color="error">{error}</Typography>}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
          >
            Register
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default RegistrationForm;
