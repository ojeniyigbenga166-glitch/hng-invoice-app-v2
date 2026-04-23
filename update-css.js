const fs = require('fs');
const cssPath = 'src/styles/Invoices.css';
let css = fs.readFileSync(cssPath, 'utf8');

const regex = /\/\*\s*Sidebar Styling\s*\*\/[\s\S]+?\/\*\s*Main Content Area\s*\*\//;
const replacement = `/* Sidebar Styling */
.sidebar {
  width: var(--sidebar-width);
  height: 100vh;
  background-color: var(--color-sidebar-navy);
  display: flex;
  flex-direction: column;
  align-items: center;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1000;
  border-radius: 0 20px 20px 0;
}

.sidebar-logo {
  width: 100%;
  height: var(--sidebar-width);
  background-color: #7C5DFA;
  border-bottom-right-radius: 20px;
  border-top-right-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  margin-bottom: auto;
}

.logo-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 50%;
  background-color: #9277FF;
  border-top-left-radius: 20px;
}

.logo-icon {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sidebar-bottom {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  width: 100%;
  padding-bottom: 24px;
}

.theme-toggle {
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.3s ease;
}

.theme-toggle:hover {
  opacity: 0.8;
}

.sidebar-divider {
  width: 100%;
  height: 1px;
  background-color: #494E6E;
  margin: 0;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Main Content Area */`;

css = css.replace(regex, replacement);

const mediaRegex = /@media \([^)]+\) {\s*\.sidebar\s*\{[\s\S]+?\}\s*}/g;
const newMedia = `@media (max-width: 1023px) {
  .sidebar {
    width: 100%;
    height: var(--sidebar-width);
    flex-direction: row;
    border-radius: 0;
    padding: 0;
  }

  .sidebar-logo {
    width: var(--sidebar-width);
    height: 100%;
    border-top-right-radius: 20px;
    border-bottom-right-radius: 20px;
    margin-bottom: 0;
    margin-right: auto;
  }
  
  .logo-overlay {
    bottom: 0px;
    height: 50%;
    width: 100%;
    border-top-left-radius: 20px;
  }

  .sidebar-bottom {
    flex-direction: row;
    width: auto;
    height: 100%;
    padding-bottom: 0;
    padding-right: 24px;
    gap: 24px;
    margin-bottom: 0;
  }

  .sidebar-divider {
    width: 1px;
    height: 100%;
    margin: 0;
  }
  
  .invoices-main {
    margin-left: 0;
    margin-top: var(--sidebar-width);
  }
  
  .invoice-form-overlay {
    left: 0;
    top: var(--sidebar-width);
    width: 100vw;
  }
}

@media (max-width: 768px) {
  .header-right { gap: 18px; }
  .hide-mobile { display: none; }
  
  .invoices-main {
    margin-left: 0;
    margin-top: var(--sidebar-width);
    margin-bottom: 0;
  }

  .header {
    flex-direction: column;
    gap: 24px;
    padding: 32px 24px;
    align-items: flex-start;
  }

  .header-right {
    width: 100%;
    justify-content: space-between;
  }

  .header-title {
    font-size: 24px;
  }

  .btn-new-invoice {
    padding: 8px 14px 8px 8px;
  }

  .btn-new-invoice .btn-text-full {
    display: none;
  }
  
  .btn-new-invoice .btn-text::after {
    content: "New";
  }
  
  .empty-state {
    padding: 24px;
  }

  .empty-state-illustration svg {
    width: 144px;
    height: 108px;
  }

  .empty-state-title {
    font-size: 20px;
  }
  
  /* Reset previous bottom orientation in Invoices.css */
  .sidebar { 
    /* overrides handled in 1023px media */ 
  }
}
`;

// replace everything after "/* Responsive Design */"
const responsiveRegex = /\/\*\s*Responsive Design\s*\*\/[\s\S]+/g;
css = css.replace(responsiveRegex, "/* Responsive Design */\n" + newMedia);

fs.writeFileSync(cssPath, css);
console.log('done modifying Invoices.css');
