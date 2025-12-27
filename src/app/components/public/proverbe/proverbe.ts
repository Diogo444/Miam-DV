import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Api } from '../../../services/api/api';
import { Proverbe as ProverbeModel } from '../../../models/proverbes.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-proverbe',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatSnackBarModule],
  templateUrl: './proverbe.html',
  styleUrl: './proverbe.scss',
})
export class Proverbe implements OnInit {
  private api = inject(Api);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);

  // State
  open = signal(false);
  proverbes = signal<ProverbeModel[]>([]);
  submitting = signal(false);
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
    this.api.getProverbe().subscribe((data) => {
      // API renvoie un objet unique (id=1) ; on homogénéise en tableau
      const normalized = Array.isArray(data) ? data : data ? [data] : [];
      this.proverbes.set(normalized);
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
