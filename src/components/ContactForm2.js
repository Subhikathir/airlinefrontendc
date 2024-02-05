import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const [contacts, setContacts] = useState([]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:5000/api/contact', formData);
      alert('Contact saved successfully');
      // After submitting, fetch the updated list of contacts
      fetchContacts();
    } catch (error) {
      console.error(error);
      alert('Error saving contact');
    }
  };

  const fetchContacts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/contacts');
      console.log('Fetched Contacts:', response.data);
      setContacts(response.data);
    } catch (error) {
      console.error('Error Fetching Contacts:', error);
    }
  };

  useEffect(() => {
    // Fetch contacts when the component mounts
    fetchContacts();
  }, []); // Empty dependency array ensures this effect runs once on mount

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input type="text" name="name" value={formData.name} onChange={handleChange} />
        </label>
        <br />
        <label>
          Email:
          <input type="email" name="email" value={formData.email} onChange={handleChange} />
        </label>
        <br />
        <label>
          Phone:
          <input type="text" name="phone" value={formData.phone} onChange={handleChange} />
        </label>
        <br />
        <button type="submit">Submit</button>
      </form>

      <ContactList contacts={contacts} />
    </div>
  );
};

const ContactList = ({ contacts }) => {
  return (
    <div>
      <h2>Submitted Contacts</h2>
      <ul>
        {contacts.map((contact) => (
          <li key={contact._id}>{contact.name} - {contact.email} - {contact.phone}</li>
        ))}
      </ul>
    </div>
  );
};

export default ContactForm;
