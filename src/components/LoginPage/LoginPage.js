// LoginPage.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../AuthContext/AuthContext'; // Add this import
import './LoginPage.css';
import API_BASE_URL from '../config';
function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formType, setFormType] = useState('login'); // 'login' or 'register'
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        console.log(data.message);
        // Redirect or perform other actions on successful login
        login({ userid:data.userId,username: data.username, email: data.email, phone: data.phone }); // Use the login function
        
        navigate('/home');
      } else {
        console.error(data.message);
        // Handle login failure
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };
  

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/api/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, phone, password }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        console.log(data.username);
        // Call login function from AuthContext with the user data
        // For example, assuming your response contains user details: { username, email, phone }
        login({userid:data.userId, username: data.username, email: data.email, phone: data.phone });
        // Redirect or perform other actions on successful login
        navigate('/home');
      } else {
        console.error(data.message);
        // Handle login failure
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };
  

  const toggleForm = () => {
    setFormType((prevFormType) => (prevFormType === 'login' ? 'register' : 'login'));
  };

  return (
    <div>
      <h1>{formType === 'login' ? 'Login Page' : 'Register Page'}</h1>

      {formType === 'login' && (
        <form onSubmit={handleLogin}>
          <label>
            Username:
            <input type="text" name="username" value={username} onChange={(e) => setUsername(e.target.value)} />
          </label>
          <br />
          <label>
            Password:
            <input type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>
          <br />
          <button type="submit">Login</button>
        </form>
      )}

{formType === 'register' && (
  <form onSubmit={handleRegister}>
    <label>
      Username:
      <input type="text" name="username" value={username} onChange={(e) => setUsername(e.target.value)} />
    </label>
    <br />
    <label>
      Email:
      <input type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
    </label>
    <br />
    <label>
      Phone:
      <input type="tel" name="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
    </label>
    <br />
    <label>
      Password:
      <input type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
    </label>
    <br />
    <button type="submit">Register</button>
  </form>
)}


      {/* Toggle Button */}
      <button onClick={toggleForm}>
        Switch to {formType === 'login' ? 'Register' : 'Login'}
      </button>

      {/* Link to Registration or Login Page based on the current form */}
      <p>
        {formType === 'login'
          ? "Don't have an account? "
          : 'Already have an account? '}
        <Link to={`/${formType}`}>{formType === 'login' ? 'Register' : 'Login'}</Link>
      </p>
    </div>
  );
}

export default LoginPage;
