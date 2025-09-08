import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import eruda from 'eruda';
import { BrowserRouter } from 'react-router-dom';

if (import.meta.env.DEV) {
  eruda.init();
}

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
