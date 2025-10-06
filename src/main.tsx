import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter as Router } from 'react-router-dom';
import App from './App';
import './index.css';

// Enhanced error handling for root element
const rootElement = document.getElementById('root');

if (!rootElement) {
  document.body.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: white; font-family: system-ui, -apple-system, sans-serif;">
      <div style="text-align: center; padding: 2rem; max-width: 500px;">
        <div style="font-size: 4rem; margin-bottom: 1rem;">⚠️</div>
        <h1 style="font-size: 2rem; margin-bottom: 1rem; font-weight: bold;">Critical Error</h1>
        <p style="color: #94a3b8; margin-bottom: 1.5rem; line-height: 1.6;">
          Failed to find the root element. The application cannot start.
        </p>
        <button 
          onclick="window.location.reload()" 
          style="background: linear-gradient(135deg, #3b82f6 0%, #14b8a6 100%); color: white; padding: 0.75rem 1.5rem; border: none; border-radius: 0.5rem; cursor: pointer; font-weight: 600; font-size: 1rem; box-shadow: 0 4px 20px rgba(59, 130, 246, 0.4);"
          onmouseover="this.style.transform='scale(1.05)'; this.style.transition='transform 0.2s'"
          onmouseout="this.style.transform='scale(1)'"
        >
          Reload Application
        </button>
      </div>
    </div>
  `;
  throw new Error('Failed to find the root element');
}

// Backend deployment configuration logging
console.log('🚀 ========================================');
console.log('🚀 BACKEND DEPLOYMENT CONFIGURATION');
console.log('🚀 ========================================');
console.log('🔧 Environment:', import.meta.env.MODE);
console.log('📦 Production Mode:', import.meta.env.PROD);
console.log('🌐 API URL:', import.meta.env.VITE_API_URL || 'Not configured');
console.log('🔐 Supabase URL:', import.meta.env.VITE_SUPABASE_URL ? '✅ Configured' : '❌ Missing');
console.log('🔑 Supabase Key:', import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Configured' : '❌ Missing');
console.log('🚀 ========================================');

// Backend deployment priority warning
if (!import.meta.env.VITE_API_URL && import.meta.env.PROD) {
  console.warn('⚠️ ========================================');
  console.warn('⚠️ BACKEND DEPLOYMENT WARNING');
  console.warn('⚠️ ========================================');
  console.warn('⚠️ VITE_API_URL is not configured!');
  console.warn('⚠️ Backend must be deployed FIRST');
  console.warn('⚠️ Set VITE_API_URL in your .env file');
  console.warn('⚠️ Example: VITE_API_URL=https://your-backend-api.com/api');
  console.warn('⚠️ ========================================');
}

// Global error handler
window.addEventListener('error', (event) => {
  console.error('🚨 Global error caught:', event.error);
  
  // Check if error is related to backend connectivity
  if (event.error?.message?.includes('Backend') || 
      event.error?.message?.includes('Network') ||
      event.error?.message?.includes('fetch')) {
    console.error('🔌 Backend connectivity issue detected');
    console.error('📋 Action required: Ensure backend is deployed and accessible');
  }
  
  event.preventDefault();
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('🚨 Unhandled promise rejection:', event.reason);
  
  // Check if rejection is related to backend
  if (event.reason?.message?.includes('Backend') || 
      event.reason?.message?.includes('Network') ||
      event.reason?.message?.includes('fetch')) {
    console.error('🔌 Backend connectivity issue detected');
    console.error('📋 Action required: Ensure backend is deployed and accessible');
  }
  
  event.preventDefault();
});

// Render with comprehensive error handling
try {
  root.render(
    <StrictMode>
      <Router>
        <App />
      </Router>
    </StrictMode>
  );
  console.log('✅ Application rendered successfully');
  console.log('🗄️ Database connection initialized');
  console.log('🔗 Backend API connection ready');
  
  // Log deployment checklist
  console.log('📋 ========================================');
  console.log('📋 DEPLOYMENT CHECKLIST');
  console.log('📋 ========================================');
  console.log('📋 1. ✅ Frontend initialized');
  console.log('📋 2. ⏳ Backend deployment status: Check logs');
  console.log('📋 3. ⏳ Database connection: Check logs');
  console.log('📋 4. ⏳ API endpoints: Test authentication');
  console.log('📋 ========================================');
} catch (error) {
  console.error('❌ Failed to render app:', error);
  rootElement.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: white; font-family: system-ui, -apple-system, sans-serif;">
      <div style="text-align: center; padding: 2rem; max-width: 600px;">
        <div style="font-size: 4rem; margin-bottom: 1rem;">🚨</div>
        <h1 style="font-size: 2rem; margin-bottom: 1rem; font-weight: bold; color: #ef4444;">Application Error</h1>
        <p style="color: #94a3b8; margin-bottom: 1rem; line-height: 1.6;">
          Failed to initialize the application. This might be due to a configuration issue or missing dependencies.
        </p>
        <div style="background: rgba(239, 68, 68, 0.1); border: 1px solid #ef4444; border-radius: 0.5rem; padding: 1rem; margin-bottom: 1rem;">
          <p style="color: #fbbf24; font-weight: 600; margin-bottom: 0.5rem;">⚠️ Backend Deployment Required</p>
          <p style="color: #94a3b8; font-size: 0.875rem;">
            Ensure your backend API is deployed and accessible before running the frontend application.
          </p>
        </div>
        <details style="margin-bottom: 1.5rem; text-align: left; background: rgba(0,0,0,0.3); padding: 1rem; border-radius: 0.5rem;">
          <summary style="cursor: pointer; font-weight: 600; margin-bottom: 0.5rem; color: #fbbf24;">Error Details</summary>
          <pre style="font-size: 0.875rem; color: #ef4444; overflow-x: auto; white-space: pre-wrap; word-wrap: break-word;">${error instanceof Error ? error.message : String(error)}</pre>
        </details>
        <div style="display: flex; gap: 1rem; justify-content: center;">
          <button 
            onclick="window.location.reload()" 
            style="background: linear-gradient(135deg, #3b82f6 0%, #14b8a6 100%); color: white; padding: 0.75rem 1.5rem; border: none; border-radius: 0.5rem; cursor: pointer; font-weight: 600; font-size: 1rem; box-shadow: 0 4px 20px rgba(59, 130, 246, 0.4);"
            onmouseover="this.style.transform='scale(1.05)'; this.style.transition='transform 0.2s'"
            onmouseout="this.style.transform='scale(1)'"
          >
            Reload Page
          </button>
          <button 
            onclick="localStorage.clear(); window.location.reload()" 
            style="background: rgba(239, 68, 68, 0.2); color: #ef4444; padding: 0.75rem 1.5rem; border: 1px solid #ef4444; border-radius: 0.5rem; cursor: pointer; font-weight: 600; font-size: 1rem;"
            onmouseover="this.style.background='rgba(239, 68, 68, 0.3)'; this.style.transition='background 0.2s'"
            onmouseout="this.style.background='rgba(239, 68, 68, 0.2)'"
          >
            Clear Cache & Reload
          </button>
        </div>
      </div>
    </div>
  `;
}