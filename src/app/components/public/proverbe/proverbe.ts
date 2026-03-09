import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { Proverbe as ProverbeModel } from '../../../models/proverbes.model';
import { Api } from '../../../services/api/api';


@Component({
  selector: 'app-proverbe',
  imports: [CommonModule],
  templateUrl: './proverbe.html',
  styleUrl: './proverbe.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Proverbe implements OnInit {
  private readonly api = inject(Api);

  readonly proverbes = signal<ProverbeModel[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  readonly blagueDeLaSemaine = computed(() =>
    this.proverbes().find((p) => p.type?.toLowerCase() === 'blague'),
  );
  readonly autresProverbes = computed(() =>
    this.proverbes().filter((p) => p.type?.toLowerCase() !== 'blague'),
  );

  ngOnInit(): void {
    this.getProverbes();
  }

  getProverbes(): void {
    this.loading.set(true);
    this.error.set(null);

    this.api.getProverbe().subscribe({
      next: (data) => {
        const normalized = Array.isArray(data) ? data : data ? [data] : [];
        this.proverbes.set(normalized);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('[Proverbe] Erreur lors du chargement:', err);
        this.proverbes.set([]);
        this.loading.set(false);
      },
    });
  }
}
