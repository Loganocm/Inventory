import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';  // Assuming this is the correct path to the login component  // Assuming this is the correct path to the signup component
import Dashboard from './components/Dashboard';  // An example of a dashboard or home page

function App() {
  return (
      <Routes>
        {/* Make the login page the default route */}
        <Route path="/" element={<LoginPage />} />

        {/* Other routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
  );
}

export default App;