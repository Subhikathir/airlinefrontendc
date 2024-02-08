import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import API_BASE_URL from '../config';
import './AddFlight.css';

function AddFlight() {
  const [formData, setFormData] = useState({
    userId: '',
    name: '',
    from: '',
    destination: '',
    priceEconomy: '',
    priceBusiness: '',
    date: new Date(),
  });

  const [cities, setCities] = useState([]);
  const [message, setMessage] = useState('');

  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/cities`);
        const data = await response.json();
        setCities(data.cities);
      } catch (error) {
        console.error('Error fetching cities:', error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleDateChange = (selectedDate) => {
    setDate(selectedDate);
    setFormData({
      ...formData,
      date: selectedDate,
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
        {cities.length > 0 && (
          <label>
            From:
            <select value={formData.from} onChange={handleChange} name="from">
              <option value="">Select a city</option>
              {cities.map((city) => (
                <option key={city._id} value={city.name}>
                  {city.name}
                </option>
              ))}
            </select>
          </label>
        )}
        <label>
          Destination:
          <select value={formData.destination} onChange={handleChange} name="destination">
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
          <DatePicker selected={date} onChange={handleDateChange} />
        </label>
        <br />
        <button type="submit">Add Flight</button>
      </form>
    </div>
  );
}

export default AddFlight;
