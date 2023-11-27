import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegistrationForm from './pages/RegistrationForm'; // Adjust the path as necessary
import LoginForm from './pages/LoginForm';
import UserPage from './pages/UserPage';
import { AuthProvider } from './AuthContext';


function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route path = "/login" element = {<LoginForm />}/>
          <Route path="/register" element={<RegistrationForm />} />
          <Route path="/menu" element={<UserPage />} />
          {/* Define other routes here */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
