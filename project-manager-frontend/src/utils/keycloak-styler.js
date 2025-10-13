// Keycloak Style Injector
// This script will inject AuraFlow styles directly into Keycloak pages

export const injectKeycloakStyles = () => {
  // Only run on Keycloak pages
  if (!window.location.href.includes('auth') && !window.location.href.includes('keycloak')) {
    return;
  }

  // Create and inject custom styles
  const styleElement = document.createElement('style');
  styleElement.id = 'auraflow-keycloak-styles';
  
  styleElement.textContent = `
    /* AuraFlow Keycloak Override - Injected via JavaScript */
    
    /* Force background styling */
    html, body {
      background: linear-gradient(135deg, #2563eb 0%, #8b5cf6 100%) !important;
      font-family: 'Inter', system-ui, -apple-system, sans-serif !important;
      margin: 0 !important;
      padding: 0 !important;
      min-height: 100vh !important;
    }
    
    /* Center the login form */
    body {
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
    }
    
    /* Style the main container */
    .login-pf-page,
    #kc-container,
    #kc-container-wrapper,
    .kc-login {
      background: transparent !important;
      width: 100% !important;
      max-width: 420px !important;
      margin: 0 auto !important;
      padding: 1rem !important;
    }
    
    /* Enhanced form styling */
    #kc-form,
    #kc-form-login,
    .card-pf,
    form {
      background: white !important;
      border-radius: 1rem !important;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important;
      padding: 2.5rem !important;
      border: none !important;
      width: 100% !important;
      box-sizing: border-box !important;
    }
    
    /* Header with AuraFlow branding */
    #kc-header-wrapper::before,
    .login-pf-header::before {
      content: "🚀 AuraFlow" !important;
      display: block !important;
      text-align: center !important;
      font-size: 2rem !important;
      font-weight: 800 !important;
      margin-bottom: 1rem !important;
      background: linear-gradient(135deg, #2563eb, #8b5cf6) !important;
      -webkit-background-clip: text !important;
      -webkit-text-fill-color: transparent !important;
      background-clip: text !important;
    }
    
    /* Page title */
    #kc-page-title {
      color: #111827 !important;
      font-size: 1.5rem !important;
      font-weight: 600 !important;
      text-align: center !important;
      margin-bottom: 2rem !important;
    }
    
    /* Form inputs */
    input[type="text"],
    input[type="email"], 
    input[type="password"],
    .pf-c-form-control {
      width: 100% !important;
      padding: 1rem !important;
      border: 2px solid #e5e7eb !important;
      border-radius: 0.75rem !important;
      font-size: 1rem !important;
      transition: all 0.2s ease !important;
      background: white !important;
      box-sizing: border-box !important;
      margin-bottom: 1rem !important;
    }
    
    input:focus {
      border-color: #2563eb !important;
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1) !important;
      outline: none !important;
    }
    
    /* Labels */
    label {
      color: #374151 !important;
      font-weight: 600 !important;
      font-size: 0.875rem !important;
      margin-bottom: 0.5rem !important;
      display: block !important;
    }
    
    /* Submit button */
    input[type="submit"],
    button[type="submit"],
    .btn-primary {
      background: linear-gradient(135deg, #2563eb, #8b5cf6) !important;
      border: none !important;
      border-radius: 0.75rem !important;
      padding: 1rem 1.5rem !important;
      font-weight: 600 !important;
      font-size: 1rem !important;
      color: white !important;
      width: 100% !important;
      cursor: pointer !important;
      transition: all 0.2s ease !important;
      margin-top: 1rem !important;
    }
    
    input[type="submit"]:hover,
    button[type="submit"]:hover,
    .btn-primary:hover {
      transform: translateY(-2px) !important;
      box-shadow: 0 10px 25px rgba(37, 99, 235, 0.4) !important;
    }
    
    /* Links */
    a {
      color: #2563eb !important;
      text-decoration: none !important;
      font-weight: 500 !important;
    }
    
    a:hover {
      color: #8b5cf6 !important;
      text-decoration: underline !important;
    }
    
    /* Error messages */
    .alert-error,
    .kc-feedback-text {
      background: #fef2f2 !important;
      border: 1px solid #fecaca !important;
      color: #dc2626 !important;
      border-radius: 0.5rem !important;
      padding: 0.75rem !important;
      margin-bottom: 1rem !important;
    }
    
    /* Hide Keycloak branding */
    .kc-logo-text {
      display: none !important;
    }
    
    /* Responsive */
    @media (max-width: 480px) {
      #kc-form,
      #kc-form-login,
      .card-pf {
        padding: 2rem !important;
        margin: 0.5rem !important;
      }
    }
  `;
  
  // Remove existing styles if any
  const existingStyles = document.getElementById('auraflow-keycloak-styles');
  if (existingStyles) {
    existingStyles.remove();
  }
  
  // Inject the styles
  document.head.appendChild(styleElement);
  
  console.log('AuraFlow Keycloak styles injected successfully');
};

// Auto-inject when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', injectKeycloakStyles);
} else {
  injectKeycloakStyles();
}

// Also inject after a short delay to catch dynamic content
setTimeout(injectKeycloakStyles, 500);
setTimeout(injectKeycloakStyles, 1000);
