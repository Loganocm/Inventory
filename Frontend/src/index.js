import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom'; // Import Router
import App from './App'; // Your main App component

ReactDOM.render(
  <Router> {/* Wrap the app with BrowserRouter */}
    <App />
  </Router>,
  document.getElementById('root')
);