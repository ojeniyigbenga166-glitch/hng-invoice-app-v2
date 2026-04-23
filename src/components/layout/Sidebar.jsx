import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../../context/ThemeContext';
import '../../styles/Sidebar.css';

export default function Sidebar() {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useContext(ThemeContext);

  return (
    <aside className="sidebar" role="navigation" aria-label="Main navigation">
      {/* Logo */}
      <div
        className="sidebar-logo"
        onClick={() => navigate('/')}
        role="link"
        tabIndex={0}
        aria-label="Go to invoices"
        onKeyDown={(e) => e.key === 'Enter' && navigate('/')}
      >
        <div className="sidebar-logo__top" aria-hidden="true" />
        <div className="logo-icon">
          <svg width="40" height="38" viewBox="0 0 40 38" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M10.6942 0L20 18.7078L29.3058 4.74611e-08C35.6645 3.34856 40 10.0219 40 17.7078C40 28.7535 31.0457 37.7078 20 37.7078C8.9543 37.7078 0 28.7535 0 17.7078C0 10.0219 4.33546 3.34856 10.6942 0Z" fill="white"/>
          </svg>
        </div>
      </div>

      {/* Bottom controls */}
      <div className="sidebar-bottom">
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? (
            /* Sun/circle icon — shown in dark mode to switch to light */
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.91783 5.08174C7.20609 5.08174 5 7.28826 5 10C5 12.7117 7.20609 14.9183 9.91783 14.9183C12.6291 14.9183 14.8357 12.7122 14.8357 10C14.8357 7.28783 12.6291 5.08174 9.91783 5.08174Z" fill="#858BB2"/>
            </svg>
          ) : (
            /* Moon icon — shown in light mode to switch to dark */
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19.5016 11.3423C19.2971 11.2912 19.0927 11.3423 18.9137 11.4701C18.2492 12.0324 17.4824 12.4924 16.639 12.7991C15.8466 13.1059 14.9776 13.2592 14.0575 13.2592C11.9872 13.2592 10.0958 12.4158 8.74121 11.0611C7.38658 9.70649 6.54313 7.81512 6.54313 5.74483C6.54313 4.87582 6.69649 4.03237 6.95208 3.26559C7.23323 2.4477 7.64217 1.70649 8.17891 1.06751C8.40895 0.786362 8.35783 0.377416 8.07668 0.147384C7.89776 0.0195887 7.69329 -0.0315295 7.48882 0.0195887C5.31629 0.607448 3.42492 1.91096 2.07029 3.64898C0.766773 5.36144 0 7.48285 0 9.78317C0 12.5691 1.1246 15.0995 2.96486 16.9397C4.80511 18.78 7.3099 19.9046 10.1214 19.9046C12.4728 19.9046 14.6454 19.0867 16.3834 17.732C18.147 16.3519 19.4249 14.3838 19.9617 12.1346C20.0639 11.7768 19.8594 11.419 19.5016 11.3423Z" fill="#7E88C3"/>
            </svg>
          )}
        </button>

        <div className="sidebar-divider" aria-hidden="true" />

        <div className="avatar">
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=invoice-user" alt="User avatar" />
        </div>
      </div>
    </aside>
  );
}
