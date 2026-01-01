import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

/**
 * Capture les erreurs globales non gérées avant même le bootstrap Angular.
 * Utile pour détecter les problèmes de chargement de chunks, erreurs de syntaxe, etc.
 */
function setupGlobalErrorListeners(): void {
  window.addEventListener('error', (event) => {
    console.error('[window.onerror] Uncaught error:', event.error || event.message);
    // Afficher un fallback si l'erreur survient avant le bootstrap
    if (!document.querySelector('app-root')?.children.length) {
      showBootstrapError('Une erreur est survenue lors du chargement de l\'application.');
    }
  });

  window.addEventListener('unhandledrejection', (event) => {
    console.error('[unhandledrejection] Unhandled promise rejection:', event.reason);
    // Erreur de chunk loading = suggérer un refresh
    if (event.reason?.message?.includes('Loading chunk') || 
        event.reason?.message?.includes('Failed to fetch dynamically imported module')) {
      showBootstrapError('Une mise à jour est disponible. Veuillez rafraîchir la page.');
    }
  });
}

/**
 * Affiche un écran d'erreur user-friendly si le bootstrap Angular échoue.
 */
function showBootstrapError(message: string): void {
  const appRoot = document.querySelector('app-root');
  if (appRoot) {
    appRoot.innerHTML = `
      <div style="
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        padding: 24px;
        font-family: 'Be Vietnam Pro', system-ui, sans-serif;
        text-align: center;
        background: #f8fcf9;
        color: #0d1b10;
      ">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <h1 style="margin: 24px 0 8px; font-size: 1.5rem; font-weight: 700;">
          Oups ! Un problème est survenu
        </h1>
        <p style="margin: 0 0 24px; color: #4c9a59; max-width: 400px;">
          ${message}
        </p>
        <button onclick="location.reload()" style="
          background: #4c9a59;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s;
        " onmouseover="this.style.background='#3d7d47'" onmouseout="this.style.background='#4c9a59'">
          Rafraîchir la page
        </button>
      </div>
    `;
  }
}

// Initialiser les listeners d'erreur avant tout
setupGlobalErrorListeners();

// Bootstrap Angular avec gestion d'erreur robuste
bootstrapApplication(App, appConfig)
  .catch((err) => {
    console.error('[Bootstrap] Application failed to start:', err);
    showBootstrapError(
      err?.message?.includes('chunk') || err?.message?.includes('module')
        ? 'Erreur de chargement. Essayez de vider le cache de votre navigateur.'
        : 'L\'application n\'a pas pu démarrer. Veuillez réessayer.'
    );
  });
