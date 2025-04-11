

import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import InvoiceList from './components/InvoiceList';
import axios from 'axios';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(null); 

  const checkLogin = async () => {
    try {
      console.log("🔁 Checking login...");
      const res = await axios.get('http://localhost:5000/api/me', {
        withCredentials: true
      });

      const user = res.data.user;
      console.log(' Logged in as:', user.displayName || user.email);

      
      const initRes = await axios.post('http://localhost:5000/api/init-user', {}, {
        withCredentials: true
      });

      console.log("init-user response:", initRes.data);
      setIsLoggedIn(true);
    } catch (err) {
      console.log(" Not logged in");
      if (err.response) {
        console.log(" Error Response from /api/me or /init-user:", err.response.data);
      } else {
        console.log(" Error:", err.message);
      }
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    checkLogin();
  }, []);

  if (isLoggedIn === null) return <p>Checking session...</p>;

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={!isLoggedIn ? <Login /> : <Navigate to="/dashboard" />}
        />
        <Route
          path="/dashboard"
          element={isLoggedIn ? <InvoiceList /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
};

export default App;
