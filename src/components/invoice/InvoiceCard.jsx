import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import '../../styles/InvoiceCard.css';

export default function InvoiceCard({ invoice }) {
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();

  const { id, clientName, paymentDue, createdAt, total, status } = invoice;
  const cleanId = id.replace('#', '');

  const dueDate = new Date(paymentDue || createdAt).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const formattedAmount = `£ ${new Intl.NumberFormat('en-GB', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(total || 0)}`;

  const handleClick = () => navigate(`/invoice/${cleanId}`);
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <article
      className={`invoice-card${hovered ? ' invoice-card--hovered' : ''}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      role="button"
      tabIndex={0}
      aria-label={`Invoice ${cleanId} for ${clientName}, ${formattedAmount}, status: ${status}`}
    >
      <span className="invoice-card__id">
        <span className="invoice-card__hash">#</span>{cleanId}
      </span>

      <span className="invoice-card__due">Due {dueDate}</span>

      <span className="invoice-card__client">{clientName}</span>

      <span className="invoice-card__amount">{formattedAmount}</span>

      <span className="invoice-card__badge-wrap">
        <StatusBadge status={status} />
      </span>

      <svg
        className="invoice-card__arrow"
        width="7"
        height="10"
        viewBox="0 0 7 10"
        fill="none"
        aria-hidden="true"
      >
        <path d="M1 1l4.228 4.228L1 9.456" stroke="#7C5DFA" strokeWidth="2" fill="none" />
      </svg>
    </article>
  );
}
