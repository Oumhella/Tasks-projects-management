// AuraFlow Keycloak Bookmarklet
// Copy this entire code, create a bookmark, and paste it as the URL
// Then click the bookmark when on Keycloak login page to apply styling

javascript:(function(){
  // Remove existing AuraFlow styles
  const existing = document.getElementById('auraflow-styles');
  if (existing) existing.remove();
  
  // Create style element
  const style = document.createElement('style');
  style.id = 'auraflow-styles';
  style.textContent = `
    html, body { 
      background: linear-gradient(135deg, #2563eb 0%, #8b5cf6 100%) !important; 
      font-family: Inter, sans-serif !important; 
      margin: 0 !important; 
      padding: 0 !important; 
      min-height: 100vh !important; 
      display: flex !important; 
      align-items: center !important; 
      justify-content: center !important; 
    }
    .login-pf-page, #kc-container, #kc-container-wrapper { 
      background: transparent !important; 
      width: 100% !important; 
      max-width: 420px !important; 
      margin: 0 auto !important; 
      padding: 1rem !important; 
    }
    #kc-form, #kc-form-login, .card-pf, form { 
      background: white !important; 
      border-radius: 1rem !important; 
      box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25) !important; 
      padding: 2.5rem !important; 
      border: none !important; 
      width: 100% !important; 
      box-sizing: border-box !important; 
    }
    #kc-header-wrapper::before { 
      content: "🚀 AuraFlow" !important; 
      display: block !important; 
      text-align: center !important; 
      font-size: 2rem !important; 
      font-weight: 800 !important; 
      margin-bottom: 1rem !important; 
      background: linear-gradient(135deg, #2563eb, #8b5cf6) !important; 
      -webkit-background-clip: text !important; 
      -webkit-text-fill-color: transparent !important; 
    }
    #kc-page-title { 
      color: #111827 !important; 
      font-size: 1.5rem !important; 
      font-weight: 600 !important; 
      text-align: center !important; 
      margin-bottom: 2rem !important; 
    }
    input[type="text"], input[type="email"], input[type="password"] { 
      width: 100% !important; 
      padding: 1rem !important; 
      border: 2px solid #e5e7eb !important; 
      border-radius: 0.75rem !important; 
      font-size: 1rem !important; 
      background: white !important; 
      box-sizing: border-box !important; 
      margin-bottom: 1rem !important; 
    }
    input:focus { 
      border-color: #2563eb !important; 
      box-shadow: 0 0 0 3px rgba(37,99,235,0.1) !important; 
      outline: none !important; 
    }
    label { 
      color: #374151 !important; 
      font-weight: 600 !important; 
      font-size: 0.875rem !important; 
      margin-bottom: 0.5rem !important; 
      display: block !important; 
    }
    input[type="submit"], button[type="submit"], .btn-primary { 
      background: linear-gradient(135deg, #2563eb, #8b5cf6) !important; 
      border: none !important; 
      border-radius: 0.75rem !important; 
      padding: 1rem 1.5rem !important; 
      font-weight: 600 !important; 
      color: white !important; 
      width: 100% !important; 
      cursor: pointer !important; 
      margin-top: 1rem !important; 
    }
    input[type="submit"]:hover, .btn-primary:hover { 
      transform: translateY(-2px) !important; 
      box-shadow: 0 10px 25px rgba(37,99,235,0.4) !important; 
    }
    a { 
      color: #2563eb !important; 
      text-decoration: none !important; 
      font-weight: 500 !important; 
    }
    a:hover { 
      color: #8b5cf6 !important; 
      text-decoration: underline !important; 
    }
  `;
  
  document.head.appendChild(style);
  
  // Show confirmation
  const notification = document.createElement('div');
  notification.textContent = '✅ AuraFlow styling applied!';
  notification.style.cssText = 'position:fixed;top:20px;right:20px;background:#10b981;color:white;padding:1rem;border-radius:0.5rem;z-index:9999;font-weight:600;';
  document.body.appendChild(notification);
  setTimeout(() => notification.remove(), 3000);
})();
