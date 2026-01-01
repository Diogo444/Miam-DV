import { ErrorHandler, Injectable, inject, NgZone } from '@angular/core';

/**
 * Global Error Handler pour capturer toutes les erreurs non gérées.
 * Affiche un message user-friendly et log les erreurs pour le debug.
 */
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private readonly zone = inject(NgZone);

  handleError(error: unknown): void {
    // Log l'erreur pour le debug (production: envoyer à un service de monitoring)
    console.error('[GlobalErrorHandler] Unhandled error:', error);

    // Extraire le message d'erreur
    const message = this.extractMessage(error);

    // Afficher une notification user-friendly (hors zone Angular pour éviter les loops)
    this.zone.runOutsideAngular(() => {
      this.showErrorNotification(message);
    });
  }

  private extractMessage(error: unknown): string {
    if (error instanceof Error) {
      // Erreurs de chunk loading (imports dynamiques échoués)
      if (error.message.includes('Loading chunk') || error.message.includes('Failed to fetch dynamically imported module')) {
        return 'Une mise à jour est disponible. Veuillez rafraîchir la page.';
      }
      // Erreurs réseau
      if (error.message.includes('NetworkError') || error.message.includes('Failed to fetch')) {
        return 'Problème de connexion. Vérifiez votre connexion internet.';
      }
      return error.message;
    }
    if (typeof error === 'string') {
      return error;
    }
    return 'Une erreur inattendue est survenue.';
  }

  private showErrorNotification(message: string): void {
    // Éviter les notifications multiples rapprochées
    const existingToast = document.getElementById('global-error-toast');
    if (existingToast) {
      existingToast.remove();
    }

    const toast = document.createElement('div');
    toast.id = 'global-error-toast';
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: #dc2626;
      color: white;
      padding: 12px 24px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 10000;
      font-family: system-ui, sans-serif;
      font-size: 14px;
      max-width: 90vw;
      text-align: center;
      animation: slideUp 0.3s ease-out;
    `;
    toast.textContent = message;

    // Ajouter l'animation CSS si elle n'existe pas
    if (!document.getElementById('error-toast-styles')) {
      const style = document.createElement('style');
      style.id = 'error-toast-styles';
      style.textContent = `
        @keyframes slideUp {
          from { opacity: 0; transform: translateX(-50%) translateY(20px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `;
      document.head.appendChild(style);
    }

    document.body.appendChild(toast);

    // Auto-dismiss après 5 secondes
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s ease-out';
      setTimeout(() => toast.remove(), 300);
    }, 5000);
  }
}
