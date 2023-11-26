import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Grid, Box, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom'
import GoogleButton from '../components/GoogleButton/GoogleButton.jsx';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../services/AxiosInstace.js'; 

const LoginForm = () => {
    const [formData, setFormData] = useState({
      email: '',
      password: '',
    });
  
    const [emailError, setEmailError] = useState(false);
    const navigate = useNavigate();
  
    const handleChange = (event) => {
      setFormData({
        ...formData,
        [event.target.name]: event.target.value,
      });
  
      // Validate email when the email field is changed
      if (event.target.name === 'email') {
        setEmailError(!validateEmail(event.target.value));
      }
    };
  
    const validateEmail = (email) => {
      // Simple email validation pattern
      const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      return re.test(String(email).toLowerCase());
    };
  
    const handleSubmit = async (event) => {
      event.preventDefault();
      // Check for email validation before proceeding with the form submission
      if (!validateEmail(formData.email)) {
        setEmailError(true);
        return; // Stop the form submission if email is not valid
      }
      try {
        // Realizar la solicitud al backend para autenticar al usuario
        const response = await axiosInstance.post('/user/login', formData);
    
        // Validar la respuesta del backend
        if (response.data && response.status === 200) {
          // Autenticación exitosa, redirige o realiza las acciones necesarias
          console.log('Usuario autenticado:', response.data);
          navigate('/');
        } else {
          // Manejar caso de autenticación fallida
          console.error('Error en la autenticación:', response.data || 'No se recibió una respuesta válida del servidor.');
        }
      } catch (error) {
        console.error('Error al realizar la solicitud de inicio de sesión:', error);
        // Puedes manejar los errores específicos aquí, como mostrar un mensaje de error al usuario.
      }
    };

  return (
    <Container maxWidth="sm">
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h3" gutterBottom>
          Login
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={formData.email}
                onChange={handleChange}
                error={emailError}
                helperText={emailError ? "Please enter a valid email address" : ""}
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
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
          >
            Login
          </Button>
          <Grid container justifyContent="center">
            <Grid item>
              <Link component={RouterLink} to="/register" variant="body2" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                Don't have an account? Register
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Box sx={{ my: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <GoogleButton />
      </Box>

    </Container>
  );
};

export default LoginForm;
