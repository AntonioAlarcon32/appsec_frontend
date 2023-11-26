import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegistrationForm from './pages/RegistrationForm'; // Adjust the path as necessary
import LoginForm from './pages/LoginForm';


function App() {
  return (
    <Router>
      <Routes>
        <Route path = "/" element = {<LoginForm />}/>
        <Route path="/register" element={<RegistrationForm />} />
        {/* Define other routes here */}
      </Routes>
    </Router>
  );
}

export default App;
