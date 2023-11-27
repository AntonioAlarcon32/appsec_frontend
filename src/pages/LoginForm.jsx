import React, { useState } from 'react';
import { Card, TextField, Button, Container, Typography, Grid, Box, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import GoogleButton from '../components/GoogleButton/GoogleButton.jsx';
import { useNavigate } from 'react-router-dom';
import axiosInstance, { setAuthToken } from '../services/AxiosInstace.js'; 
import { useAuth } from '../AuthContext.jsx';

const LoginForm = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [emailError, setEmailError] = useState(false);
    const navigate = useNavigate();
    const { isLoggedIn, login } = useAuth();

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });

        if (event.target.name === 'email') {
            setEmailError(!validateEmail(event.target.value));
        }
    };

    const validateEmail = (email) => {
        const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        return re.test(String(email).toLowerCase());
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!validateEmail(formData.email)) {
            setEmailError(true);
            return;
        }
        try {
            const response = await axiosInstance.post('/auth/login', formData);
    
            if (response.data && response.status === 200) {
                console.log('User authenticated:', response.data);
                setAuthToken(response.data.token);
                login();
                navigate('/menu');
            } else {
                console.error('Authentication error:', response.data || 'Did not get a valid response from the server.');
            }
        } catch (error) {
            console.error('Error while making login request:', error);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ bgcolor: 'background.default', py: 5, height: '100vh' }}>
            <Card elevation={3} sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography component="h1" variant="h4" gutterBottom>
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
                            sx={{ mt: 3, mb: 2, bgcolor: 'primary.main', '&:hover': { bgcolor: 'primary.dark' } }}
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
                <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <GoogleButton />
                </Box>
            </Card>
        </Container>
    );
};

export default LoginForm;
