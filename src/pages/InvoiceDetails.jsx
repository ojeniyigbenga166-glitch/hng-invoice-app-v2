import React, { useState, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import InvoiceForm from '../components/form/InvoiceForm';
import DeleteModal from '../components/ui/DeleteModal';
import StatusBadge from '../components/invoice/StatusBadge';
import { InvoiceContext } from '../context/InvoiceContext';
import '../styles/InvoiceDetails.css';

/* Format a date string to "21 Aug 2021" */
const fmtDate = (d) => {
  if (!d) return '—';
  try {
    return new Date(d).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return d;
  }
};

/* Format currency: £ 1,800.90 */
const fmtCurrency = (n) =>
  `£ ${new Intl.NumberFormat('en-GB', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(n) || 0)}`;

export default function InvoiceDetails() {
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  const { invoices, loading, updateInvoice, deleteInvoice } = useContext(InvoiceContext);
  const invoice = invoices.find((inv) => inv.id === id || inv.id === `#${id}`);

  /* Loading */
  if (loading) {
    return (
      <div className="invoice-details-page">
        <Sidebar />
        <div className="invoice-details-container">
          <div className="invoice-details-inner">
            <div className="loading-state" role="status">Loading…</div>
          </div>
        </div>
      </div>
    );
  }

  /* Not found */
  if (!invoice) {
    return (
      <div className="invoice-details-page">
        <Sidebar />
        <div className="invoice-details-container">
          <div className="invoice-details-inner">
            <button className="back-btn" onClick={() => navigate(-1)} aria-label="Go back">
              <svg width="7" height="10" viewBox="0 0 7 10" fill="none" aria-hidden="true">
                <path d="M6 1L2 5l4 4" stroke="#9277FF" strokeWidth="2" strokeLinecap="round" />
              </svg>
              Go back
            </button>
            <p className="not-found-msg" role="alert">Invoice not found.</p>
          </div>
        </div>
      </div>
    );
  }

  const handleMarkAsPaid = () => updateInvoice(invoice.id, { ...invoice, status: 'paid' });
  const handleDelete = () => { deleteInvoice(invoice.id); navigate('/'); };
  const cleanId = invoice.id.replace('#', '');

  return (
    <div className="invoice-details-page">
      <Sidebar />

      <div className="invoice-details-container">
        {/* ── Centered inner wrapper ── */}
        <div className="invoice-details-inner">

          {/* Back */}
          <button className="back-btn" onClick={() => navigate(-1)} aria-label="Go back to invoices">
            <svg width="7" height="10" viewBox="0 0 7 10" fill="none" aria-hidden="true">
              <path d="M6 1L2 5l4 4" stroke="#9277FF" strokeWidth="2" strokeLinecap="round" />
            </svg>
            Go back
          </button>

          {/* Status bar */}
          <div className="details-header">
            <div className="status-section">
              <span>Status</span>
              <StatusBadge status={invoice.status} />
            </div>
            <div className="action-buttons">
              {/* Edit: draft + pending only */}
              {invoice.status !== 'paid' && (
                <button id="edit-invoice-btn" className="btn btn-edit"
                  onClick={() => setIsEditFormOpen(true)} aria-label="Edit invoice">
                  Edit
                </button>
              )}

              {/* Delete: always */}
              <button id="delete-invoice-btn" className="btn btn-delete"
                onClick={() => setIsDeleteModalOpen(true)} aria-label="Delete invoice">
                Delete
              </button>

              {/* Mark as Paid: pending only */}
              {invoice.status === 'pending' && (
                <button id="mark-paid-btn" className="btn btn-mark-paid"
                  onClick={handleMarkAsPaid} aria-label="Mark invoice as paid">
                  Mark as Paid
                </button>
              )}
            </div>
          </div>

          {/* Main card */}
          <main className="details-body" aria-label="Invoice details">
            <div className="body-top">
              <div className="id-desc">
                <h1><span>#</span>{cleanId}</h1>
                <p>{invoice.description}</p>
              </div>
              <address className="sender-address">
                <p>{invoice.senderAddress?.street}</p>
                <p>{invoice.senderAddress?.city}</p>
                <p>{invoice.senderAddress?.postCode}</p>
                <p>{invoice.senderAddress?.country}</p>
              </address>
            </div>

            <div className="body-middle">
              <div className="dates">
                <div className="date-group">
                  <p>Invoice Date</p>
                  <h3>{fmtDate(invoice.createdAt)}</h3>
                </div>
                <div className="date-group">
                  <p>Payment Due</p>
                  <h3>{fmtDate(invoice.paymentDue)}</h3>
                </div>
              </div>
              <div className="bill-to">
                <p>Bill To</p>
                <h3>{invoice.clientName}</h3>
                <address>
                  <p>{invoice.clientAddress?.street}</p>
                  <p>{invoice.clientAddress?.city}</p>
                  <p>{invoice.clientAddress?.postCode}</p>
                  <p>{invoice.clientAddress?.country}</p>
                </address>
              </div>
              <div className="sent-to">
                <p>Sent to</p>
                <h3>{invoice.clientEmail}</h3>
              </div>
            </div>

            {/* Items table */}
            <div className="items-table" role="table" aria-label="Invoice items">
              <div className="table-header" role="row">
                <p role="columnheader">Item Name</p>
                <p className="qty" role="columnheader">QTY.</p>
                <p className="price" role="columnheader">Price</p>
                <p className="total" role="columnheader">Total</p>
              </div>
              {(invoice.items || []).map((item, index) => (
                <div className="table-row" key={index} role="row">
                  <h4 role="cell">{item.name}</h4>
                  <p className="qty" role="cell">{item.quantity || item.qty}</p>
                  <p className="price" role="cell">{fmtCurrency(item.price)}</p>
                  <h4 className="total" role="cell">{fmtCurrency(item.total)}</h4>
                </div>
              ))}
              <div className="table-footer">
                <p>Amount Due</p>
                <h2>{fmtCurrency(invoice.total)}</h2>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Edit form */}
      <InvoiceForm
        isOpen={isEditFormOpen}
        onClose={() => setIsEditFormOpen(false)}
        invoice={invoice}
      />

      {/* Delete confirmation modal */}
      {isDeleteModalOpen && (
        <DeleteModal
          invoiceId={cleanId}
          onConfirm={() => { setIsDeleteModalOpen(false); handleDelete(); }}
          onCancel={() => setIsDeleteModalOpen(false)}
        />
      )}
    </div>
  );
}