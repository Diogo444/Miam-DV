import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api/api.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-proverbeajout',
  imports: [ReactiveFormsModule],
  templateUrl: './proverbeajout.component.html',
  styleUrls: ['./proverbeajout.component.scss'], // Correction de styleUrl en styleUrls
})
export class ProverbeajoutComponent implements OnDestroy {
  proverbe: FormGroup;
  message: string = '';
  private destroy$ = new Subject<void>();

  constructor(private apiservice: ApiService) {
    this.proverbe = new FormGroup({
      proverbe: new FormControl(''),
    });
  }

  PSubmit(): void {
    this.apiservice
      .ProverbeAjout(this.proverbe.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (resp) => {
          this.message = `Le proverbe ${this.proverbe.value.proverbe} a été ajouté.`;
          setTimeout(() => {
            this.message = '';
          }, 3000);
          this.proverbe.reset();
        },
        (error) => {
          this.message =
            "Une erreur s'est produite lors de l'ajout du proverbe.";
        }
      );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
