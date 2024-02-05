import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import API_BASE_URL from '../config';
function AddFlight() {
  const [formData, setFormData] = useState({
    userId: '', // You may get this from your authentication context
    name: '',
    from: '',
    destination: '',
    priceEconomy: '',
    priceBusiness: '',
    date: new Date(), // Initialize with the current date
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
        console.log(data.message);
        // You may redirect or show a success message
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error('Error adding flight:', error.message);
    }
  };

  return (
    <div>
      <h1>Add New Flight</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input type="text" name="name" value={formData.name} onChange={handleChange} />
        </label>
        <br />
        <label>
          From:
          <input type="text" name="from" value={formData.from} onChange={handleChange} />
        </label>
        <br />
        <label>
          Destination:
          <input type="text" name="destination" value={formData.destination} onChange={handleChange} />
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
