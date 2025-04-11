import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import '../styles/login.css'; 

const Login = () => {
  const handleLoginSuccess = (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      console.log('User Info (Decoded):', decoded);

   
      window.location.href = 'http://localhost:5000/auth/google';
    } catch (err) {
      console.error('Google login decode error:', err);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title">
          Welcome to <span className="brand-name">TensorGo</span>
        </h1>
        <p className="login-subtitle">Invoice Reminder System</p>

        <div className="login-btn-container">
          <GoogleLogin
            onSuccess={handleLoginSuccess}
            onError={() => console.log('Login Failed')}
            useOneTap
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
