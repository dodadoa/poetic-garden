import React from 'react';
import { createRoot } from 'react-dom/client'
import "@fontsource/croissant-one"

import './index.css';

import App from './App';
import reportWebVitals from './reportWebVitals';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
reportWebVitals();
