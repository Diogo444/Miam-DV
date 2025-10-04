import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api/api.service';
import { ProverbeajoutComponent } from '../proverbeajout/proverbeajout.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-menuajout',
  imports: [ReactiveFormsModule, ProverbeajoutComponent],
  templateUrl: './menuajout.component.html',
  styleUrls: ['./menuajout.component.scss'],
})
export class MenuajoutComponent implements OnDestroy {
  menu: FormGroup;
  message: string = '';
  private destroy$ = new Subject<void>();

  constructor(private apiservice: ApiService) {
    this.menu = new FormGroup({
      jour: new FormControl(''),
      periode: new FormControl(''),
      entree: new FormControl(''),
      plats: new FormControl(''),
      accompagnement: new FormControl(''),
      fromage: new FormControl(''),
      dessert: new FormControl(''),
    });
  }

  MSubmit() {
    this.apiservice
      .MenuAjout(this.menu.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (response) => {
          this.message = `Le menu pour le ${this.menu.value.jour} ${this.menu.value.periode} a été ajouté.`;
          setTimeout(() => {
            this.message = '';
          }, 3000);
          this.menu.reset();
        },
        (error) => {
          this.message = "Une erreur s'est produite lors de l'ajout du menu.";
        }
      );
  }

  vider(): void {
    this.apiservice
      .menuvider()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (response) => {
          this.message = 'Le menu de cette semaine a bien été vidé.';
          setTimeout(() => {
            this.message = '';
          }, 3000);
        },
        (error) => {
          this.message = "Une erreur s'est produite lors du vidage du menu.";
          setTimeout(() => {
            this.message = '';
          }, 3000);
        }
      );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
