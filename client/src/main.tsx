// client/src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css'; // Keep Tailwind base/CSS variables here
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';

// --- MUI Imports ---
import CssBaseline from '@mui/material/CssBaseline'; // Normalizes browser styles
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'; // Or AdapterDayjs, etc.

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* MUI Theme Provider */}
      {/* MUI X Date Picker Localization Provider */}
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <CssBaseline /> {/* Apply baseline CSS normalization */}
        {/* React Query Provider */}
        <QueryClientProvider client={queryClient}>
          {/* Your Auth Provider */}
          <AuthProvider>
            <App />
          </AuthProvider>
        </QueryClientProvider>
      </LocalizationProvider>
  </React.StrictMode>
);