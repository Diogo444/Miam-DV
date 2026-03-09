import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  output,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Api } from '../../../../services/api/api';

@Component({
  selector: 'app-add',
  imports: [CommonModule, ReactiveFormsModule, MatSnackBarModule],
  templateUrl: './add.html',
  styleUrl: './add.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Add {
  private readonly api = inject(Api);
  private readonly fb = inject(FormBuilder);
  private readonly snackBar = inject(MatSnackBar);

  readonly created = output<void>();

  readonly open = signal(false);
  readonly submitting = signal(false);
  readonly statusMessage = signal<{ type: 'success' | 'error'; text: string } | null>(null);

  readonly form = this.fb.group({
    type: this.fb.nonNullable.control('Blague', [Validators.required]),
    content: this.fb.nonNullable.control('', [
      Validators.required,
      Validators.minLength(3),
    ]),
  });

  submitSuggestion(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);

    const payload = this.form.getRawValue();

    this.api.addSuggestion(payload).subscribe({
      next: () => {
        this.form.reset({ type: 'Blague', content: '' });
        this.open.set(false);
        this.showStatusMessage('success', 'Merci ! Votre proposition a ete envoyee.');
        this.snackBar.open('Merci ! Votre proposition a ete envoyee.', 'Fermer', {
          duration: 5000,
        });
        this.created.emit();
      },
      error: (err) => {
        console.error('[Add] Erreur lors de l envoi de la suggestion:', err);
        this.submitting.set(false);
        this.showStatusMessage('error', "Impossible d'envoyer la proposition, reessayez.");
        this.snackBar.open("Impossible d'envoyer la proposition, reessayez.", 'Fermer', {
          duration: 5000,
        });
      },
      complete: () => {
        this.submitting.set(false);
      },
    });
  }

  toggleOpen(): void {
    this.open.update((value) => !value);
  }

  private showStatusMessage(type: 'success' | 'error', text: string): void {
    this.statusMessage.set({ type, text });
    setTimeout(() => this.statusMessage.set(null), 5000);
  }
}
