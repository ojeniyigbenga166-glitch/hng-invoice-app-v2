import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import InvoiceProvider from './context/InvoiceContext';
import { ThemeProvider } from './context/ThemeContext';
import InvoicesPage from './pages/Invoices';
import InvoiceDetails from './pages/InvoiceDetails';
import './styles/global.css';

export default function App() {
  return (
    <ThemeProvider>
      <InvoiceProvider>
        <Router>
          <Routes>
            <Route path="/" element={<InvoicesPage />} />
            <Route path="/invoice/:id" element={<InvoiceDetails />} />
            {/* Redirect any old routes */}
            <Route path="/invoices" element={<Navigate to="/" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </InvoiceProvider>
    </ThemeProvider>
  );
}
