<<<<<<< HEAD
import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api/api.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-miammiajout',
  imports: [FormsModule],
  templateUrl: './miammi.component.html',
  styleUrls: ['./miammi.component.scss'], // Correction de styleUrl en styleUrls
})
export class MiammiajoutComponent implements OnDestroy {
  message: string = '';
  private destroy$ = new Subject<void>();

  constructor(private apiservice: ApiService) {}

  onSubmit(): void {
    this.apiservice
      .MiammiAjout(this.message)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (resp) => {
          this.message = '';
        },
        (error) => {
          console.error("Erreur lors de l'ajout du message :", error);
        }
      );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
=======
import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api/api.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-miammiajout',
  imports: [FormsModule],
  templateUrl: './miammi.component.html',
  styleUrls: ['./miammi.component.scss'], // Correction de styleUrl en styleUrls
})
export class MiammiajoutComponent implements OnDestroy {
  message: string = '';
  private destroy$ = new Subject<void>();

  constructor(private apiservice: ApiService) {}

  onSubmit(): void {
    this.apiservice
      .MiammiAjout(this.message)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (resp) => {
          this.message = '';
        },
        (error) => {
          console.error("Erreur lors de l'ajout du message :", error);
        }
      );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
>>>>>>> afe05af085bf6474cb15d6eaf7a64896e5a8f91a
