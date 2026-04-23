import InvoiceCard from './InvoiceCard';

export default function InvoiceList({ invoices = [], filters }) {
  // Apply filter: if all false (or filters not set), show all
  const anyActive = filters && (filters.draft || filters.pending || filters.paid);
  const filtered = anyActive
    ? invoices.filter((inv) => filters[inv.status?.toLowerCase()])
    : invoices;

  if (filtered.length === 0) {
    return (
      <div className="empty-state" role="status" aria-live="polite">
        <div className="empty-state-content">
          <div className="empty-state-illustration" aria-hidden="true">
            {/* Figma empty state: woman with megaphone in envelope */}
            <svg width="242" height="200" viewBox="0 0 242 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Envelope body */}
              <path d="M30 80 L121 140 L212 80 L212 175 Q212 185 202 185 L40 185 Q30 185 30 175 Z" fill="white" stroke="#DFE3FA" strokeWidth="2"/>
              {/* Envelope flap open */}
              <path d="M30 80 L121 135 L212 80 L212 75 Q212 65 202 65 L40 65 Q30 65 30 75 Z" fill="#F9FAFE" stroke="#DFE3FA" strokeWidth="2"/>
              {/* Envelope side left */}
              <path d="M30 80 L30 175" stroke="#DFE3FA" strokeWidth="2"/>
              {/* Envelope side right */}
              <path d="M212 80 L212 175" stroke="#DFE3FA" strokeWidth="2"/>
              {/* Letter lines inside envelope */}
              <rect x="70" y="100" width="102" height="6" rx="3" fill="#DFE3FA" opacity="0.6"/>
              <rect x="80" y="115" width="82" height="6" rx="3" fill="#DFE3FA" opacity="0.4"/>

              {/* Woman body */}
              <ellipse cx="121" cy="62" rx="32" ry="38" fill="#7C5DFA"/>
              {/* Woman head */}
              <circle cx="121" cy="30" r="16" fill="#FFDBC5"/>
              {/* Hair */}
              <path d="M105 26 Q108 10 121 10 Q134 10 137 26 Q134 20 121 20 Q108 20 105 26Z" fill="#1E2139"/>
              {/* Hair sides */}
              <path d="M105 26 Q100 32 102 40 L107 36 Q105 30 107 26Z" fill="#1E2139"/>
              <path d="M137 26 Q142 32 140 40 L135 36 Q137 30 135 26Z" fill="#1E2139"/>

              {/* Left arm holding megaphone */}
              <path d="M89 58 Q72 52 65 45" stroke="#FFDBC5" strokeWidth="8" strokeLinecap="round"/>
              {/* Megaphone */}
              <path d="M48 30 L68 42 L68 52 L48 42 Z" fill="#7C5DFA"/>
              <path d="M38 34 Q44 36 48 30 Q44 44 38 46 Z" fill="#9277FF"/>
              <rect x="68" y="43" width="14" height="8" rx="2" fill="#7C5DFA"/>
              {/* Megaphone sound waves */}
              <path d="M28 32 Q24 38 28 44" stroke="#DFE3FA" strokeWidth="2" strokeLinecap="round"/>
              <path d="M22 28 Q16 38 22 48" stroke="#DFE3FA" strokeWidth="1.5" strokeLinecap="round"/>

              {/* Right arm resting */}
              <path d="M153 58 Q168 62 170 72" stroke="#FFDBC5" strokeWidth="8" strokeLinecap="round"/>

              {/* Flying envelopes / mail icons */}
              {/* Top right small envelope */}
              <rect x="175" y="12" width="28" height="20" rx="3" fill="none" stroke="#DFE3FA" strokeWidth="1.5"/>
              <path d="M175 16 L189 24 L203 16" stroke="#DFE3FA" strokeWidth="1.5"/>
              {/* Bottom right small envelope */}
              <rect x="190" y="100" width="22" height="16" rx="2" fill="none" stroke="#DFE3FA" strokeWidth="1.5"/>
              <path d="M190 103 L201 109 L212 103" stroke="#DFE3FA" strokeWidth="1.5"/>
              {/* Top left small envelope */}
              <rect x="20" y="20" width="22" height="16" rx="2" fill="none" stroke="#DFE3FA" strokeWidth="1.5"/>
              <path d="M20 23 L31 29 L42 23" stroke="#DFE3FA" strokeWidth="1.5"/>
              {/* Paper plane */}
              <path d="M178 145 L205 135 L185 155 Z" fill="none" stroke="#DFE3FA" strokeWidth="1.5" strokeLinejoin="round"/>
              <path d="M185 155 L193 145" stroke="#DFE3FA" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <h2 className="empty-state-title">There is nothing here</h2>
          <p className="empty-state-message">
            {anyActive
              ? 'No invoices match the selected filter. Try a different status.'
              : <>Create a new invoice by clicking the <strong>New Invoice</strong> button and get started.</>}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="invoice-list" role="list" aria-label="Invoice list">
      {filtered.map((invoice) => (
        <div key={invoice.id} role="listitem">
          <InvoiceCard invoice={invoice} />
        </div>
      ))}
    </div>
  );
}
