import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { setAuthToken } from '../services/AxiosInstace.js';
import axiosInstance from '../services/AxiosInstace.js'; 
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';

const UserPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    // Function to parse query params
    const useQuery = () => {
        return new URLSearchParams(location.search);
    };

    const { isLoggedIn, isLoading, login } = useAuth();

    const query = useQuery();
    const token = query.get('token');

    const handleButtonClick = () => {
        axiosInstance.get('/hello/hello')
            .then(response => {
                console.log('Response:', response.data);
                // Handle your response here
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    };

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
    },[token, isLoggedIn, isLoading, login, navigate]);

    if (isLoading) {
        return <div>Loading...</div>; // Or any other loading indicator
    }

    if (!isLoggedIn) {
        navigate('/login');
        return null;
    }

    return (
        <div>
            <h1>Welcome to the User Page!</h1>
            <p>This is the main welcome page for the user.</p>
            <button onClick={handleButtonClick}>Call Endpoint</button>
        </div>
    );
};


export default UserPage;
