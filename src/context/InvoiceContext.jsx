import { createContext, useContext, useEffect, useState } from 'react';
import seedData from '../data/invoices.json';

export const InvoiceContext = createContext();

const STORAGE_KEY = 'hng-invoice-app-invoices';

export default function InvoiceProvider({ children }) {
  const [invoices, setInvoices] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored !== null) {
        const parsed = JSON.parse(stored);
        // If stored but empty array, seed anyway
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      // First time or empty — seed with sample data
      return seedData;
    } catch {
      return seedData;
    }
  });

  const [loading] = useState(false);
  const [error, setError] = useState(null);

  // Persist to localStorage whenever invoices change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(invoices));
    } catch (err) {
      console.error('Failed to persist invoices to localStorage', err);
    }
  }, [invoices]);

  const addInvoice = (invoice) => {
    const existingIds = new Set(invoices.map((inv) => inv.id));
    let id = `RT${Math.floor(1000 + Math.random() * 9000)}`;
    while (existingIds.has(id)) {
      id = `RT${Math.floor(1000 + Math.random() * 9000)}`;
    }
    const newInvoice = { ...invoice, id };
    setInvoices((current) => [...current, newInvoice]);
    setError(null);
    return newInvoice;
  };

  const updateInvoice = (id, updatedData) => {
    setInvoices((current) =>
      current.map((inv) => (inv.id === id ? { ...inv, ...updatedData, id } : inv))
    );
    setError(null);
  };

  const deleteInvoice = (id) => {
    setInvoices((current) => current.filter((inv) => inv.id !== id));
    setError(null);
  };

  return (
    <InvoiceContext.Provider
      value={{ invoices, loading, error, addInvoice, updateInvoice, deleteInvoice }}
    >
      {children}
    </InvoiceContext.Provider>
  );
}

export function useInvoices() {
  return useContext(InvoiceContext);
}
