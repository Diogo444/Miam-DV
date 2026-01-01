import { Component, OnInit, signal, inject, computed, ChangeDetectionStrategy } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Api } from '../../../services/api/api';
import { Proverbe as ProverbeModel } from '../../../models/proverbes.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-proverbe',
  imports: [ReactiveFormsModule, CommonModule, MatSnackBarModule],
  templateUrl: './proverbe.html',
  styleUrl: './proverbe.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Proverbe implements OnInit {
  private api = inject(Api);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);

  // State
  open = signal(false);
  proverbes = signal<ProverbeModel[]>([]);
  submitting = signal(false);
  loading = signal(true);
  error = signal<string | null>(null);
  
  blagueDeLaSemaine = computed(() =>
    this.proverbes().find((p) => p.type?.toLowerCase() === 'blague'),
  );
  autresProverbes = computed(() =>
    this.proverbes().filter((p) => p.type?.toLowerCase() !== 'blague'),
  );

  // Form
  form = this.fb.group({
    type: ['Blague', [Validators.required]],
    content: ['', [Validators.required, Validators.minLength(3)]],
  });

  ngOnInit() {
    this.getProverbes();
  }

  getProverbes() {
    this.loading.set(true);
    this.error.set(null);
    
    this.api.getProverbe().subscribe({
      next: (data) => {
        // API renvoie un objet unique (id=1) ; on homogénéise en tableau
        const normalized = Array.isArray(data) ? data : data ? [data] : [];
        this.proverbes.set(normalized);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('[Proverbe] Erreur lors du chargement:', err);
        // On ne bloque pas l'UI, juste on ne montre pas de proverbe
        this.proverbes.set([]);
        this.loading.set(false);
        // Pas de message d'erreur visible car ce n'est pas critique
      }
    });
  }

  toggleOpen() {
    this.open.update((v) => !v);
  }

  submitSuggestion() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);

    const formValue = this.form.value;
    const payload = {
      type: formValue.type || 'Blague',
      content: formValue.content || '',
    };
    console.log(payload);

    this.api.addSuggestion(payload).subscribe({
      next: () => {
        this.getProverbes();
        this.form.reset({ type: 'Blague', content: '' });
        this.open.set(false);
        this.snackBar.open('Merci ! Votre proposition a été envoyée.', 'Fermer', {
          duration: 5000,
        });
        console.log("Suggestion envoyée avec succès.");
      },
      error: (err) => {
        console.error(err);
        this.submitting.set(false);
        this.snackBar.open("Impossible d'envoyer la proposition, réessayez.", 'Fermer', {
          duration: 5000,
        });
      },
      complete: () => {
        this.submitting.set(false);
      },
    });
  }
}
