import '../../styles/StatusBadge.css';

export default function StatusBadge({ status }) {
  const normalised = (status || 'draft').toLowerCase();
  return (
    <span className={`status-badge status-${normalised}`} aria-label={`Status: ${normalised}`}>
      <span className="status-dot" aria-hidden="true" />
      <span className="status-text">{normalised.charAt(0).toUpperCase() + normalised.slice(1)}</span>
    </span>
  );
}
