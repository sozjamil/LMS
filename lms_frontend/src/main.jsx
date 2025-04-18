import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'; // Import Router
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext';
import './index.css'


createRoot(document.getElementById('root')).render(
  <StrictMode>
      <BrowserRouter>
        {/* Wrap the entire app */}
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
  </StrictMode>
);
