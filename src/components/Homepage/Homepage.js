// Homepage.js
import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../AuthContext/AuthContext';
import './Homepage.css';
function TicketBookingLink() {
  const { user } = useAuth();

  if (user) {
    return <Link to="/ticket-booking">Ticket Booking</Link>;
  } else {
    return (
      <span>
        Please <Link to="/login">login</Link> to access Ticket Booking.
      </span>
    );
  }
}

function Homepage() {
  const { user, logout } = useAuth();
  // Log the user ID
  console.log('User ID:', user ? user.userid: 'No user logged in');
  return (
    <div className="homepage-container">
      <h1>Welcome to the Air Flight Booking</h1>
      <nav>
        <Link to="/">Home</Link>
        {TicketBookingLink()}
        {user ? (
          <>
            <span>Hello, {user.username}</span>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
        <Link to="/addflight">AddFlight</Link>
      </nav>
    </div>
  );
}

export default Homepage;
