import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { setAuthToken } from '../services/AxiosInstance.js';
import axiosInstance from '../services/AxiosInstance.js'; 
import { useAuth } from '../AuthContext.jsx';
import { Button, Typography, Container } from '@mui/material';

const UserPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { isLoggedIn, isLoading, login, logout } = useAuth();

    const useQuery = () => {
        return new URLSearchParams(location.search);
    };

    const query = useQuery();
    const token = query.get('token');

    const handleFilecenterButtonClick = () => {
        // Navigate to the Filecenter page
        navigate('/files'); 
    };

    const handleLogoutClick = () => {
        // Logout the user
        setAuthToken(null);
        axiosInstance.post('/auth/logout')
        .then(response => {
            console.log('Response:', response.data);
        })
        .catch(error => {
            console.error('There was an error!', error);
        });
        logout();
        navigate('/login');
    }


    useEffect(() => {
        console.log('UserPage useEffect');

        if (isLoading) {
            // If still loading, don't do anything yet
            return;
        }
        
        if (token) {
            axiosInstance.post('/auth/exchange-token', { token: token }
            )
            .then(response => {
                console.log('Response:', response.data);
                setAuthToken(response.data.token);
                login();
                navigate('/menu');
            })
            .catch(error => {
                console.error('There was an error!', error);
                navigate('/login');
            });
        } else if (!isLoggedIn) {
            console.log('UserPage useEffect: no token and not logged in');
            navigate('/login');
        }
    }, [token, isLoggedIn, isLoading, login, navigate]);

    if (isLoading) {
        return <Typography>Loading...</Typography>;
    }

    if (!isLoggedIn) {
        navigate('/login');
        return null;
    }

    return (
        <Container maxWidth="sm" sx={{ bgcolor: 'background.default', py: 5, height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography component="h1" variant="h4" gutterBottom>
                Welcome to the User Page!
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
                This is the main welcome page for the user.
            </Typography>
            <Button variant="contained" color="primary" onClick={handleFilecenterButtonClick}>
                Go to Filecenter
            </Button>
            <Button variant="contained" color="primary" onClick={handleLogoutClick}>
                Logout
            </Button>
        </Container>
    );
};

export default UserPage;
