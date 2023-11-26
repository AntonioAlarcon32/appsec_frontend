import React from 'react';
import { ReactComponent as GoogleLogo } from './oauth_google.svg';

const GoogleButton = () => {
  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:3500/auth/google';
  };

  return (
    <button
      onClick={handleGoogleLogin}
      style={{
        background: 'transparent', // Set background to transparent
        border: 'none',           // Remove border
        cursor: 'pointer',
        padding: '10px',          // Adjust padding as needed
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        outline: 'none'
      }}
      onMouseEnter={(e) => e.target.style.opacity = '0.8'} // Dim slightly on hover
      onMouseLeave={(e) => e.target.style.opacity = '1'}   // Back to normal on mouse leave
    >
      <GoogleLogo /> {/* Adjust SVG size as needed */}
    </button>
  );
};

export default GoogleButton;
