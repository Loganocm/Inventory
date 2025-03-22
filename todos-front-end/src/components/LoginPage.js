import React, { useState, useEffect, useRef } from 'react'; 
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const navigate = useNavigate();
  const isMounted = useRef(true);  // Use useRef to track mount status

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errorMessage, setErrorMessage] = useState('');

  const { email, password } = formData;

  useEffect(() => {
    isMounted.current = true;  // Component is mounted

    return () => {
      isMounted.current = false;  // Cleanup: component is unmounted
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/auth/login`, formData);

      // Ensure component is still mounted before updating state
      if (isMounted.current) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('username', response.data.username);
        navigate('/dashboard');
      }
    } catch (error) {
      if (isMounted.current) {
        setErrorMessage(error.response?.data?.message || 'Something went wrong!');
      }
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default LoginPage;