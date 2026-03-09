import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Api } from '../../../../services/api/api';
import { Proverbe as ProverbeModel } from '../../../../models/proverbes.model';

@Component({
  selector: 'app-show',
  imports: [],
  templateUrl: './show.html',
  styleUrl: './show.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Show {
  private readonly api = inject(Api);

  readonly proverbe = signal<ProverbeModel | null>(null);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  readonly blagueDeLaSemaine = computed(() =>
    this.proverbe()?.type?.toLowerCase() === 'blague' ? this.proverbe() : null,
  );
  readonly autresProverbes = computed(() =>
    this.proverbe() && this.proverbe()?.type?.toLowerCase() !== 'blague'
      ? [this.proverbe() as ProverbeModel]
      : [],
  );

  constructor() {
    this.getProverbes();
  }

  getProverbes(): void {
    this.loading.set(true);
    this.error.set(null);

    this.api.getSuggestedProverbe().subscribe({
      next: (data) => {
        this.proverbe.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('[Proverbe] Erreur lors du chargement:', err);
        this.proverbe.set(null);
        this.error.set('Impossible de charger la suggestion de la semaine.');
        this.loading.set(false);
      },
    });
  }
}
