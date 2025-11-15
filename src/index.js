// Path: (both apps)/src/index.js

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom'; // <-- 1. Import this

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* 2. Wrap App in the router */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);