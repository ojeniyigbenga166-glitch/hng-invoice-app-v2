import React, { useState, useContext, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { InvoiceContext } from '../../context/InvoiceContext';
import { validateInvoice } from '../../utils/validation';
import '../../styles/InvoiceForm.css';

/* ── helpers ── */
const today = () => new Date().toISOString().split('T')[0];

function emptyFields(invoice) {
  return {
    senderStreet: invoice?.senderAddress?.street ?? '',
    senderCity: invoice?.senderAddress?.city ?? '',
    senderPostCode: invoice?.senderAddress?.postCode ?? '',
    senderCountry: invoice?.senderAddress?.country ?? '',
    clientName: invoice?.clientName ?? '',
    clientEmail: invoice?.clientEmail ?? '',
    clientStreet: invoice?.clientAddress?.street ?? '',
    clientCity: invoice?.clientAddress?.city ?? '',
    clientPostCode: invoice?.clientAddress?.postCode ?? '',
    clientCountry: invoice?.clientAddress?.country ?? '',
    createdAt: invoice?.createdAt ?? today(),
    paymentTerms: String(invoice?.paymentTerms ?? 30),
    description: invoice?.description ?? '',
  };
}

function emptyItems(invoice) {
  if (invoice?.items?.length) {
    return invoice.items.map((it) => ({
      id: it.id ?? Date.now() + Math.random(),
      name: it.name ?? '',
      qty: String(it.quantity ?? it.qty ?? 1),
      price: String(it.price ?? 0),
    }));
  }
  return [{ id: Date.now(), name: '', qty: '1', price: '0' }];
}

/* ─────────────────────────────────────── */
export default function InvoiceForm({ isOpen, onClose, invoice }) {
  const navigate = useNavigate();
  const { addInvoice, updateInvoice } = useContext(InvoiceContext);
  const firstFocusRef = useRef(null);
  const formRef = useRef(null);

  /* ── fully controlled field state ── */
  const [fields, setFields] = useState(() => emptyFields(invoice));
  const [items, setItems] = useState(() => emptyItems(invoice));
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState('');

  /* reset when form opens or invoice changes */
  useEffect(() => {
    setFields(emptyFields(invoice));
    setItems(emptyItems(invoice));
    setErrors({});
    setGlobalError('');
  }, [invoice, isOpen]);

  /* body scroll lock + focus on open */
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const t = setTimeout(() => firstFocusRef.current?.focus(), 120);
    return () => {
      clearTimeout(t);
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  /* ESC closes */
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  /* ── field helpers ── */
  const setField = (name, value) => {
    setFields((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((e) => ({ ...e, [name]: null }));
    setGlobalError('');
  };

  /* ── items helpers ── */
  const addItem = () =>
    setItems((prev) => [
      ...prev,
      { id: Date.now(), name: '', qty: '1', price: '0' },
    ]);

  const updateItem = (id, field, value) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, [field]: value } : it))
    );
    if (errors.itemDetails || errors.items)
      setErrors((e) => ({ ...e, itemDetails: null, items: null }));
    setGlobalError('');
  };

  const removeItem = (id) =>
    setItems((prev) => prev.filter((it) => it.id !== id));

  /* ── submit ── */
  const handleSubmit = (actionStatus) => {
    const isDraft = actionStatus === 'draft';

    /* build the data object directly from controlled state */
    const data = {
      clientName: fields.clientName.trim(),
      clientEmail: fields.clientEmail.trim(),
      description: fields.description.trim(),
    };

    const { valid, errors: validationErrors } = validateInvoice(data, items, isDraft);

    if (!valid) {
      setErrors(validationErrors);

      /* build a human-readable summary for the bottom banner */
      const msgs = [];
      if (validationErrors.clientName) msgs.push('client name');
      if (validationErrors.clientEmail) msgs.push('client email');
      if (validationErrors.description) msgs.push('project description');
      if (validationErrors.items) msgs.push('at least one item');
      if (validationErrors.itemDetails) msgs.push('item details (name, qty, price)');

      setGlobalError(
        `Please fix the following: ${msgs.join(', ')}.`
      );

      /* scroll to top of form */
      formRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setErrors({});
    setGlobalError('');

    /* compute payment due */
    const createdAtDate = new Date(fields.createdAt || today());
    const paymentTerms = Number(fields.paymentTerms) || 30;
    const paymentDueDate = new Date(createdAtDate);
    paymentDueDate.setDate(paymentDueDate.getDate() + paymentTerms);

    const invoiceData = {
      senderAddress: {
        street: fields.senderStreet,
        city: fields.senderCity,
        postCode: fields.senderPostCode,
        country: fields.senderCountry,
      },
      clientName: data.clientName,
      clientEmail: data.clientEmail,
      clientAddress: {
        street: fields.clientStreet,
        city: fields.clientCity,
        postCode: fields.clientPostCode,
        country: fields.clientCountry,
      },
      createdAt: fields.createdAt || today(),
      paymentTerms,
      paymentDue: paymentDueDate.toISOString().split('T')[0],
      description: data.description,
      items: items.map((item) => ({
        id: item.id,
        name: item.name.trim(),
        quantity: Number(item.qty),
        qty: Number(item.qty),
        price: Number(item.price),
        total: Number(item.qty) * Number(item.price),
      })),
      total: items.reduce(
        (acc, cur) => acc + Number(cur.qty) * Number(cur.price),
        0
      ),
      status: (() => {
        // Draft → pending when fully saved with valid data
        if (invoice && invoice.status === 'draft' && !isDraft) return 'pending';
        // Keep existing status for pending/paid edits
        if (invoice) return invoice.status;
        // New invoice
        return actionStatus;
      })(),
    };

    if (invoice) {
      updateInvoice(invoice.id, invoiceData);
      onClose();
    } else {
      const newInvoice = addInvoice(invoiceData);
      onClose();
      if (newInvoice?.id) navigate(`/invoice/${newInvoice.id}`);
    }
  };

  /* ── render helpers ── */
  const itemError = (id, field) => {
    if (!errors.itemDetails) return false;
    const idx = items.findIndex((it) => it.id === id);
    return idx !== -1 && errors.itemDetails[idx]?.[field];
  };

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('invoice-form-overlay')) onClose();
  };

  if (!isOpen) return null;

  /* ── JSX ── */
  return (
    <div
      className={`invoice-form-overlay${isOpen ? ' open' : ''}`}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-label={invoice ? `Edit Invoice ${invoice.id}` : 'New Invoice'}
    >
      <div className="invoice-form-container" ref={formRef}>
        <h2 className="form-header-title">
          {invoice
            ? <>Edit <span className="form-id-hash">#</span>{invoice.id.replace('#', '')}</>
            : 'New Invoice'}
        </h2>

        <form className="invoice-form" id="invoiceForm" onSubmit={(e) => e.preventDefault()} noValidate>

          {/* ── BILL FROM ── */}
          <h3 className="form-section-title">Bill From</h3>

          <div className="form-group">
            <label className="form-label" htmlFor="senderStreet">Street Address</label>
            <input id="senderStreet" type="text" className="form-input-field"
              placeholder="19 Union Terrace"
              value={fields.senderStreet}
              onChange={(e) => setField('senderStreet', e.target.value)} />
          </div>

          <div className="form-row three-col">
            <div className="form-group">
              <label className="form-label" htmlFor="senderCity">City</label>
              <input id="senderCity" type="text" className="form-input-field"
                placeholder="London"
                value={fields.senderCity}
                onChange={(e) => setField('senderCity', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="senderPostCode">Post Code</label>
              <input id="senderPostCode" type="text" className="form-input-field"
                placeholder="E1 3EZ"
                value={fields.senderPostCode}
                onChange={(e) => setField('senderPostCode', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="senderCountry">Country</label>
              <input id="senderCountry" type="text" className="form-input-field"
                placeholder="United Kingdom"
                value={fields.senderCountry}
                onChange={(e) => setField('senderCountry', e.target.value)} />
            </div>
          </div>

          {/* ── BILL TO ── */}
          <h3 className="form-section-title">Bill To</h3>

          <div className="form-group">
            <div className="form-label-row">
              <label className="form-label" htmlFor="clientName">Client's Name</label>
              {errors.clientName && <span className="field-error-msg">{errors.clientName}</span>}
            </div>
            <input
              ref={firstFocusRef}
              id="clientName"
              type="text"
              className={`form-input-field${errors.clientName ? ' input-error' : ''}`}
              placeholder="Alex Grim"
              value={fields.clientName}
              onChange={(e) => setField('clientName', e.target.value)}
            />
          </div>

          <div className="form-group">
            <div className="form-label-row">
              <label className="form-label" htmlFor="clientEmail">Client's Email</label>
              {errors.clientEmail && <span className="field-error-msg">{errors.clientEmail}</span>}
            </div>
            <input
              id="clientEmail"
              type="email"
              className={`form-input-field${errors.clientEmail ? ' input-error' : ''}`}
              placeholder="alexgrim@mail.com"
              value={fields.clientEmail}
              onChange={(e) => setField('clientEmail', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="clientStreet">Street Address</label>
            <input id="clientStreet" type="text" className="form-input-field"
              placeholder="84 Church Way"
              value={fields.clientStreet}
              onChange={(e) => setField('clientStreet', e.target.value)} />
          </div>

          <div className="form-row three-col">
            <div className="form-group">
              <label className="form-label" htmlFor="clientCity">City</label>
              <input id="clientCity" type="text" className="form-input-field"
                placeholder="Bradford"
                value={fields.clientCity}
                onChange={(e) => setField('clientCity', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="clientPostCode">Post Code</label>
              <input id="clientPostCode" type="text" className="form-input-field"
                placeholder="BD1 9PB"
                value={fields.clientPostCode}
                onChange={(e) => setField('clientPostCode', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="clientCountry">Country</label>
              <input id="clientCountry" type="text" className="form-input-field"
                placeholder="United Kingdom"
                value={fields.clientCountry}
                onChange={(e) => setField('clientCountry', e.target.value)} />
            </div>
          </div>

          <div className="form-row two-col">
            <div className="form-group">
              <label className="form-label" htmlFor="createdAt">Invoice Date</label>
              <input
                id="createdAt"
                type="date"
                className="form-input-field"
                value={fields.createdAt}
                disabled={!!invoice}
                onChange={(e) => setField('createdAt', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="paymentTerms">Payment Terms</label>
              <select
                id="paymentTerms"
                className="form-input-field"
                value={fields.paymentTerms}
                onChange={(e) => setField('paymentTerms', e.target.value)}
              >
                <option value="1">Net 1 Day</option>
                <option value="7">Net 7 Days</option>
                <option value="14">Net 14 Days</option>
                <option value="30">Net 30 Days</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <div className="form-label-row">
              <label className="form-label" htmlFor="description">Project Description</label>
              {errors.description && <span className="field-error-msg">{errors.description}</span>}
            </div>
            <input
              id="description"
              type="text"
              className={`form-input-field${errors.description ? ' input-error' : ''}`}
              placeholder="e.g. Graphic Design Service"
              value={fields.description}
              onChange={(e) => setField('description', e.target.value)}
            />
          </div>

          {/* ── ITEM LIST ── */}
          <div className="item-list-section">
            <h3 className="item-list-title">Item List</h3>

            <div className="item-list-container">
              <div className="item-list-header" aria-hidden="true">
                <span className="col-name">Item Name</span>
                <span className="col-qty">Qty.</span>
                <span className="col-price">Price</span>
                <span className="col-total">Total</span>
                <span className="col-action" />
              </div>

              {items.map((item, index) => (
                <div key={item.id} className="item-row" role="group" aria-label={`Item ${index + 1}`}>
                  <div className="item-field field-name">
                    <span className="mobile-label">Item Name</span>
                    <input
                      type="text"
                      className={`form-input-field${itemError(item.id, 'name') ? ' input-error' : ''}`}
                      value={item.name}
                      aria-label={`Item ${index + 1} name`}
                      onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                    />
                  </div>
                  <div className="item-field field-qty">
                    <span className="mobile-label">Qty.</span>
                    <input
                      type="number"
                      className={`form-input-field${itemError(item.id, 'qty') ? ' input-error' : ''}`}
                      value={item.qty}
                      min="1"
                      aria-label={`Item ${index + 1} quantity`}
                      onChange={(e) => updateItem(item.id, 'qty', e.target.value)}
                    />
                  </div>
                  <div className="item-field field-price">
                    <span className="mobile-label">Price</span>
                    <input
                      type="number"
                      className={`form-input-field${itemError(item.id, 'price') ? ' input-error' : ''}`}
                      value={item.price}
                      min="0"
                      step="0.01"
                      aria-label={`Item ${index + 1} price`}
                      onChange={(e) => updateItem(item.id, 'price', e.target.value)}
                    />
                  </div>
                  <div className="item-field field-total">
                    <span className="mobile-label">Total</span>
                    <div className="item-total-value">
                      {(parseFloat(item.qty || 0) * parseFloat(item.price || 0)).toFixed(2)}
                    </div>
                  </div>
                  <div className="item-field field-action">
                    <button
                      type="button"
                      className="btn-delete-item"
                      onClick={() => removeItem(item.id)}
                      aria-label={`Remove item ${index + 1}`}
                    >
                      <svg width="13" height="16" viewBox="0 0 13 16" fill="none" aria-hidden="true">
                        <path
                          d="M11.5833 3.33333C11.5833 3.33333 11.5833 15 11.5833 14.1667C11.5833 15.0875 10.8375 15.8333 9.91667 15.8333H3.25C2.32917 15.8333 1.58333 15.0875 1.58333 14.1667C1.58333 15 1.58333 3.33333 1.58333 3.33333M0.75 3.33333H12.4167M9.08333 3.33333V1.66667C9.08333 0.745833 8.3375 0 7.41667 0H5.75C4.82917 0 4.08333 0.745833 4.08333 1.66667V3.33333"
                          stroke="#888EB0"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {errors.items && (
              <p className="item-error-msg">{errors.items}</p>
            )}

            <button type="button" className="btn-add-item" onClick={addItem}>
              + Add New Item
            </button>
          </div>

          {/* ── GLOBAL ERROR BANNER ── */}
          {globalError && (
            <div className="form-global-error" role="alert">
              {globalError}
            </div>
          )}

          {/* ── ACTIONS ── */}
          <div className="form-actions">
            {invoice ? (
              <>
                <button type="button" className="btn-cancel" onClick={onClose} style={{ marginRight: 'auto' }}>
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn-save-send"
                  onClick={() => handleSubmit(invoice.status || 'pending')}
                >
                  Save Changes
                </button>
              </>
            ) : (
              <>
                <button type="button" className="btn-cancel" onClick={onClose}>
                  Discard
                </button>
                <button
                  type="button"
                  className="btn-save-draft"
                  onClick={() => handleSubmit('draft')}
                >
                  Save as Draft
                </button>
                <button
                  type="button"
                  className="btn-save-send"
                  onClick={() => handleSubmit('pending')}
                >
                  Save &amp; Send
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
