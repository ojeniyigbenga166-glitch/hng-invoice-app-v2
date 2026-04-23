import React, { useState, useContext, useRef, useEffect } from 'react';
import Sidebar from '../components/layout/Sidebar';
import InvoiceList from '../components/invoice/InvoiceList';
import InvoiceForm from '../components/form/InvoiceForm';
import { InvoiceContext } from '../context/InvoiceContext';
import '../styles/Invoices.css';

/* ── Filter Dropdown ── */
function FilterDropdown({ filters, onChange, onClose, containerRef }) {
  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [containerRef, onClose]);

  return (
    <div className="filter-dropdown" role="group" aria-label="Filter by status">
      {['draft', 'pending', 'paid'].map((status) => (
        <label key={status} className="custom-checkbox">
          <input
            type="checkbox"
            checked={filters[status]}
            onChange={() => onChange(status)}
            aria-label={`Filter by ${status}`}
          />
          <span className="checkmark" aria-hidden="true" />
          <span className="checkbox-label">{status.charAt(0).toUpperCase() + status.slice(1)}</span>
        </label>
      ))}
    </div>
  );
}

/* ── Page Header ── */
function PageHeader({ invoices, filters, onFilterChange, onNewInvoice }) {
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef(null);

  const anyActive = filters.draft || filters.pending || filters.paid;
  const displayed = anyActive
    ? invoices.filter((inv) => filters[inv.status?.toLowerCase()]).length
    : invoices.length;

  const activeCount = Object.values(filters).filter(Boolean).length;

  return (
    <header className="invoices-header">
      <div className="invoices-header__left">
        <h1 className="invoices-header__title">Invoices</h1>
        <p className="invoices-header__subtitle">
          {displayed === 0
            ? 'No invoices'
            : anyActive
              ? `${displayed} invoice${displayed !== 1 ? 's' : ''} found`
              : `There are ${displayed} total invoices`}
        </p>
      </div>

      <div className="invoices-header__right">
        {/* Filter */}
        <div className="filter-container" ref={filterRef}>
          <button
            className="filter-trigger"
            onClick={() => setFilterOpen((o) => !o)}
            aria-expanded={filterOpen}
            aria-haspopup="true"
            aria-controls="filter-dropdown"
          >
            <span className="filter-trigger__label">
              Filter <span className="hide-mobile"> by status</span>
              {activeCount > 0 && (
                <span className="filter-active-count" aria-label={`${activeCount} filters active`}>
                  {activeCount}
                </span>
              )}
            </span>
            <svg
              className={`chevron${filterOpen ? ' open' : ''}`}
              width="11"
              height="7"
              viewBox="0 0 11 7"
              fill="none"
              aria-hidden="true"
            >
              <path d="M1 1l4.228 4.228L9.456 1" stroke="#7C5DFA" strokeWidth="2" fill="none" />
            </svg>
          </button>

          {filterOpen && (
            <FilterDropdown
              filters={filters}
              onChange={onFilterChange}
              onClose={() => setFilterOpen(false)}
              containerRef={filterRef}
            />
          )}
        </div>

        {/* New Invoice */}
        <button
          id="new-invoice-btn"
          className="btn-new-invoice"
          onClick={onNewInvoice}
          aria-label="Create new invoice"
        >
          <span className="btn-icon-circle" aria-hidden="true">
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
              <path d="M6.313 10.023v-3.71h3.71v-2.58h-3.71V.023h-2.58v3.71H.023v2.58h3.71v3.71h2.58z" fill="#7C5DFA" />
            </svg>
          </span>
          New <span className="hide-mobile"> Invoice</span>
        </button>
      </div>
    </header>
  );
}

/* ── Main Page ── */
export default function InvoicesPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [filters, setFilters] = useState({ draft: false, pending: false, paid: false });
  const { invoices, loading, error } = useContext(InvoiceContext);

  const handleFilterChange = (status) => {
    setFilters((prev) => ({ ...prev, [status]: !prev[status] }));
  };

  return (
    <div className="invoices-page">
      <Sidebar />

      <main className="invoices-main" id="main-content">
        <PageHeader
          invoices={invoices}
          filters={filters}
          onFilterChange={handleFilterChange}
          onNewInvoice={() => setIsFormOpen(true)}
        />

        <div className="invoices-list-wrap">
          {loading ? (
            <div className="loading-state" role="status" aria-live="polite">Loading invoices…</div>
          ) : error ? (
            <div className="error-state" role="alert">Error: {error}</div>
          ) : (
            <InvoiceList invoices={invoices} filters={filters} />
          )}
        </div>
      </main>

      <InvoiceForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
    </div>
  );
}
