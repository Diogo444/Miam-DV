import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { Suggestion } from '../../../models/suggestions.model';
import { Api } from '../../../services/api/api';

type SuggestionType = 'jokes' | 'proverbs';

@Component({
  selector: 'app-afficher-suggestions',
  imports: [],
  templateUrl: './afficher-suggestions.html',
  styleUrl: './afficher-suggestions.scss',
})
export class AfficherSuggestions implements OnInit {
  protected readonly api = inject(Api);

  activeTab: SuggestionType = 'jokes';

  readonly suggestionsSignal = signal<Suggestion[]>([]);
  readonly loading = signal(true);
  readonly loadError = signal<string | null>(null);
  statusMessage: { type: 'success' | 'error'; text: string } | null = null;
  
  readonly jokes = computed(() =>
    this.suggestionsSignal().filter(
      (suggestion) => this.normalizeType(suggestion.type) === 'blague',
    ),
  );
  readonly proverbs = computed(() =>
    this.suggestionsSignal().filter(
      (suggestion) => this.normalizeType(suggestion.type) === 'proverbe',
    ),
  );

  setTab(type: SuggestionType): void {
    this.activeTab = type;
  }

  ngOnInit(): void {
    this.getSuggestion();
  }

  getSuggestion(): void {
    this.loading.set(true);
    this.loadError.set(null);
    
    this.api.getSuggestions().subscribe({
      next: (data) => {
        this.suggestionsSignal.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('[AfficherSuggestions] Erreur:', err);
        this.loadError.set('Impossible de charger les suggestions.');
        this.loading.set(false);
      }
    });
  }
  
  retry(): void {
    this.getSuggestion();
  }

  approveSuggestion(type: SuggestionType, suggestion: Suggestion): void {
    console.log('Approved suggestion:', suggestion.content);
    this.api.acceptSuggestion(suggestion.id).subscribe({
      next: () => {
        console.log('Suggestion accepted on backend');
        this.statusMessage = {
          type: 'success',
          text: 'La suggestion a bien été approuvée.',
        };
        this.removeSuggestion(type, suggestion.id);
      },
      error: (err) => {
        console.error('Error accepting suggestion on backend:', err);
        this.statusMessage = {
          type: 'error',
          text: err?.error?.message || "Impossible d'approuver la suggestion.",
        };
      }
    });
  }

  rejectSuggestion(type: SuggestionType, suggestion: Suggestion): void {
    this.api.removeSuggestion(suggestion.id).subscribe({
      next: () => {
        console.log('Suggestion deleted on backend');
        this.statusMessage = {
          type: 'success',
          text: 'La suggestion a bien été rejetée.',
        };
        this.removeSuggestion(type, suggestion.id);
      },
      error: (err) => {
        console.error('Error deleting suggestion on backend:', err);
        this.statusMessage = {
          type: 'error',
          text: err?.error?.message || 'Impossible de rejeter la suggestion.',
        };
      }
    });
  }

  private removeSuggestion(_type: SuggestionType, id: number): void {
    this.suggestionsSignal.update((items) => items.filter((item) => item.id !== id));
  }

  private normalizeType(type: string | null | undefined): 'blague' | 'proverbe' | '' {
    const normalized = type?.toLowerCase();
    if (normalized === 'blague' || normalized === 'proverbe') {
      return normalized;
    }
    return '';
  }

}
