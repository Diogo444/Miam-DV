import {
  Component,
  ElementRef,
  effect,
  inject,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Api } from '../../../../services/api/api';

@Component({
  selector: 'app-add',
  imports: [ReactiveFormsModule, MatSnackBarModule],
  templateUrl: './add.html',
  styleUrl: './add.scss',
})
export class Add {
  private readonly api = inject(Api);
  private readonly fb = inject(FormBuilder);
  private readonly snackBar = inject(MatSnackBar);

  readonly created = output<void>();

  readonly open = signal(false);
  readonly submitting = signal(false);
  readonly statusMessage = signal<{ type: 'success' | 'error'; text: string } | null>(null);
  private readonly toggleButton = viewChild<ElementRef<HTMLButtonElement>>('toggleButton');
  private readonly contentField = viewChild<ElementRef<HTMLTextAreaElement>>('contentField');

  readonly form = this.fb.group({
    type: this.fb.nonNullable.control('Blague', [Validators.required]),
    content: this.fb.nonNullable.control('', [
      Validators.required,
      Validators.minLength(3),
    ]),
  });

  constructor() {
    effect(() => {
      if (this.open()) {
        this.contentField()?.nativeElement.focus();
      }
    });
  }

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
    const willOpen = !this.open();
    this.open.set(willOpen);
    if (!willOpen) {
      queueMicrotask(() => this.toggleButton()?.nativeElement.focus());
    }
  }

  private showStatusMessage(type: 'success' | 'error', text: string): void {
    this.statusMessage.set({ type, text });
    setTimeout(() => this.statusMessage.set(null), 5000);
  }
}
