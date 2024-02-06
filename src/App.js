// App.js
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './components/Homepage/Homepage';
import LoginPage from './components/LoginPage/LoginPage';
import TicketBooking from './components/TicketBooking/TicketBooking'; // Import your TicketBooking component
import AddFlight from './components/AddFlight/AddFlight'; // Adjust the path based on your project structure

import { AuthProvider } from './components/AuthContext/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
        <Route path="/" element={<Homepage />} />
          <Route path="/home" element={<Homepage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/ticket-booking" element={<TicketBooking />} />
          <Route path="/addflight" element={<AddFlight />} />
        
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
