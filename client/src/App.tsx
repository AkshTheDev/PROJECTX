// client/src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import DashboardPage from './pages/DashboardPage';
import InvoiceHistoryPage from './pages/InvoiceHistoryPage';
import CreateInvoicePage from './pages/CreateInvoicePage';
import ClientPage from './pages/ClientPage';
import GstReportsPage from './pages/GstReportsPage';
import ProfilePage from './pages/ProfilePage';
import { ProtectedRoute } from './components/auth/ProtectedRoute'; // <-- Import

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/invoices" element={<InvoiceHistoryPage />} />
          <Route path="/invoices/new" element={<CreateInvoicePage />} />
          <Route path="/clients" element={<ClientPage />} />
          <Route path="/reports/gst" element={<GstReportsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;