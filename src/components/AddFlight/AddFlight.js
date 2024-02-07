
import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import API_BASE_URL from '../config';
import './AddFlight.css';
function AddFlight() {
  const [formData, setFormData] = useState({
    userId: '', // You may get this from your authentication context
    name: '',
    from: 'Select a city',
    destination: 'Select a city',
    priceEconomy: '',
    priceBusiness: '',
    date: new Date(), // Initialize with the current date
  });
  const [cities, setCities] = useState([]);
  const [from, setFrom] = useState('');
  const [destination, setDestination] = useState('');
  const [message, setMessage] = useState('');
  useEffect(() => {
    // Fetch the list of cities from MongoDB
    fetch(`${API_BASE_URL}/api/cities`)
      .then((response) => response.json())
      .then((data) => setCities(data.cities))
      .catch((error) => console.error('Error fetching cities:', error));
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleDateChange = (date) => {
    setFormData({
      ...formData,
      date,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_BASE_URL}/api/add-flight`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        console.log(data.message);
         // Reset form data
      setFormData({
        userId: '',
        name: '',
        from: '',
        destination: '',
        priceEconomy: '',
        priceBusiness: '',
        date: new Date(),
      });
      setFrom(''); // Reset "From" dropdown
      setDestination(''); // Reset "Destination" dropdown

        // You may redirect or show a success message
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error('Error adding flight:', error.message);
    }
  };

  return (
    <div className="add-flight-container">
      <h1>Add New Flight</h1>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input type="text" name="name" value={formData.name} onChange={handleChange} />
        </label>
        <br />
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
        <br />
        <label>
          Price (Economy):
          <input type="text" name="priceEconomy" value={formData.priceEconomy} onChange={handleChange} />
        </label>
        <br />
        <label>
          Price (Business):
          <input type="text" name="priceBusiness" value={formData.priceBusiness} onChange={handleChange} />
        </label>
        <br />
        <label>
          Date:
          <DatePicker selected={formData.date} onChange={handleDateChange} />
        </label>
        <br />
        <button type="submit">Add Flight</button>
      </form>
    </div>
  );
}

export default AddFlight;
