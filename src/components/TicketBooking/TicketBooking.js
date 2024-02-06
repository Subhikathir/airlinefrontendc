import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext/AuthContext';

//import { format } from 'date-fns';
import './TicketBooking.css';
import API_BASE_URL from '../config';
function TicketBooking() {
  const { user } = useAuth();
  const [from, setFrom] = useState('');
  const [destination, setDestination] = useState('');
  const [cities, setCities] = useState([]);
  const [availableFlights, setAvailableFlights] = useState([]);
  const [bookedTickets, setBookedTickets] = useState([]);
  const [currentuser, setCurrentuser] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [selectedClass, setSelectedClass] = useState('economy');
  
  useEffect(() => {
    // Fetch the list of cities from MongoDB
    fetch(`${API_BASE_URL}/api/cities`)
      .then((response) => response.json())
      .then((data) => setCities(data.cities))
      .catch((error) => console.error('Error fetching cities:', error));

    // Fetch booked tickets when the component mounts
    if (user && user.userid) {
      setLoading(true);
      fetch(`${API_BASE_URL}/api/my-bookings/${user.userid}`)
        .then((response) => response.json())
        .then((data) => {
          setBookedTickets(data.tickets);
          setCurrentuser(data.currentuser);
        })
        .catch((error) => {
          console.error('Error fetching booked tickets:', error);
          setError('Error fetching booked tickets');
        })
        .finally(() => setLoading(false));
    }

    // Log the user ID
    console.log('User ID:', user ? user.userid : 'No user logged in');
  }, [user]);

  const handleCancelTicket = async (ticketId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/cancel-ticket/${ticketId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Remove the canceled ticket from the state
        setBookedTickets((prevTickets) => prevTickets.filter((ticket) => ticket._id !== ticketId));
        console.log('Ticket canceled successfully');
      } else {
        console.error('Failed to cancel ticket');
      }
    } catch (error) {
      console.error('Error canceling ticket:', error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFlight || !selectedClass || !user) {
      console.error('Please select both a flight and class');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/ticket-booking`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.userid,
          from: selectedFlight.from,
          destination: selectedFlight.destination,
          flightName: selectedFlight.name,
          date: selectedFlight.date,
          price: selectedClass === 'economy' ? selectedFlight.priceEconomy : selectedFlight.priceBusiness,
          class: selectedClass,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log(data.message);
        setBookedTickets([...bookedTickets, { ...data.ticket }]);
        // Clear selected flight and class after booking
        setSelectedFlight(null);
        setSelectedClass('economy');
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error('Error during ticket booking:', error.message);
    }
  };

  const fetchAvailableFlights = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/available-flights?from=${from}&destination=${destination}`);
      const data = await response.json();

      if (response.ok) {
        setAvailableFlights(data.flights);
      } else {
        console.error('Failed to fetch available flights');
      }
    } catch (error) {
      console.error('Error fetching available flights:', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="background-container1">
    <div className="background-container container mt-5">    <h1 className="text-center">Ticket Booking</h1>
    <form onSubmit={handleSubmit} className="mb-4">
    <div className="row">
      <div className="col-md-6">
        <label>
          From:
          <select value={from} onChange={(e) => setFrom(e.target.value)}>
            <option value="">Select a city</option>
            {cities.map((city) => (
              <option key={city._id} value={city.name}>
                {city.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="col-md-6 text-right">
        <label>
          Destination:
          <select value={destination} onChange={(e) => setDestination(e.target.value)}>
            <option value="">Select a city</option>
            {cities.map((city) => (
              <option key={city._id} value={city.name}>
                {city.name}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
    <br />
    <div className="text-center">
      <button type="button" onClick={fetchAvailableFlights} disabled={!from || !destination || loading} className="btn btn-primary">
        {loading ? 'Fetching Flights...' : 'Fetch Available Flights'}
      </button>
    </div>
        <div className="text-center">
          <h2>Available Flights</h2>
          {loading && <p>Loading available flights...</p>}
          {!loading && availableFlights.length === 0 ? (
            <p>No available flights.</p>
          ) : (
            <table className="table">
            <thead>
              <tr>
                <th>From</th>
                <th>Destination</th>
                <th>Name</th>
                <th>Date</th>
                <th>Price (Economy)</th>
                <th>Price (Business)</th>
                <th>Select</th>
              </tr>
            </thead>
            <tbody>
              {availableFlights.map((flight, index) => (
                <tr key={index}>
                  <td>{flight.from}</td>
                  <td>{flight.destination}</td>
                  <td>{flight.name}</td>
                  <td>{new Date(flight.date).toLocaleDateString()}</td>
                  <td>{flight.priceEconomy}</td>
                  <td>{flight.priceBusiness}</td>
                  <td>
                    <input
                      type="radio"
                      name="flightSelection"
                      checked={selectedFlight === flight}
                      onChange={() => setSelectedFlight(flight)}
                    />
                    <button type="button" className="btn btn-primary" onClick={() => setSelectedFlight(flight)}>
                      Select Flight
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          )}
        </div>
        <br />
        <label>
          Class:
          <input
            type="radio"
            name="classSelection"
            value="economy"
            checked={selectedClass === 'economy'}
            onChange={() => setSelectedClass('economy')}
          />
          <label>Economy</label>
          <input
            type="radio"
            name="classSelection"
            value="business"
            checked={selectedClass === 'business'}
            onChange={() => setSelectedClass('business')}
          />
          <label>Business</label>
        </label>
        <br />
        <button type="submit" disabled={!selectedFlight || !selectedClass || loading}>
          {loading ? 'Booking...' : 'Book Ticket'}
        </button>
      </form>

      <div>
        <h2>My Booked Tickets</h2>
        {loading && <p>Loading booked tickets...</p>}
        {error && <p>{error}</p>}
        {!loading && !error && (
          <>
            {Array.isArray(bookedTickets) && bookedTickets.length === 0 ? (
              <p>No booked tickets available.</p>
            ) : (
              <ul className="table">
                {Array.isArray(bookedTickets) &&
                  bookedTickets.map((ticket, index) => (
                    <li key={index}>
                    <strong>From:</strong> {ticket.from}, <strong>Destination:</strong> {ticket.destination}, {' '}
                    <strong>Flight Name:</strong> {ticket.flightName}, <strong>Price:</strong> {ticket.price}, {' '}
                    <strong>Date:</strong> {new Date(ticket.date).toLocaleDateString()},{' '}
                    <button onClick={() => handleCancelTicket(ticket._id)}>Cancel</button>
                  </li>
                  ))}
              </ul>
            )}
          </>
        )}
      </div>

      <div>
        <h2>Current User</h2>
        {currentuser && <p>Username: {currentuser.username}</p>}
      </div>
    </div>
    </div>
  );
}

export default TicketBooking;
