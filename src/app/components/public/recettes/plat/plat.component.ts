<<<<<<< HEAD
import { Component, Input, OnInit } from '@angular/core';
import { recipe } from '../recipe.model';
import { ApiService } from '../../../../services/api/api.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-plat',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './plat.component.html',
  styleUrls: ['./plat.component.scss'],
})
export class PlatComponent implements OnInit {
  @Input() slug: string = '';
  plat: recipe[] = [];
  sanitizedIngredients: string[] = [];
  sanitizedUstensiles: string[] = [];
  sanitizedPreparation: string[] = [];

  constructor(private apiservice: ApiService) {}

  ngOnInit(): void {
    if (this.slug) {
      this.apiservice
        .getrecipe(this.slug)
        .pipe(
          catchError((error) => {
            console.error(
              'Erreur lors de la récupération de la recette',
              error
            );
            return of([] as recipe[]);
          })
        )
        .subscribe((plat: recipe[]) => {
          if (
            plat.length > 0 &&
            plat[0].ingredients &&
            plat[0].ustensiles &&
            plat[0].preparation
          ) {
            this.plat = plat;
            this.sanitizedIngredients = this.sanitizeList(plat[0].ingredients);
            this.sanitizedUstensiles = this.sanitizeList(plat[0].ustensiles);
            this.sanitizedPreparation = this.sanitizeList(plat[0].preparation);
          } else {
            console.warn('Recette invalide ou aucune recette trouvée');
          }
        });
    }
  }

  sanitizeList(items: string[]): string[] {
    return items.map((item) => (item.trim() ? item : ''));
  }
}
=======
import { Component, Input, OnInit } from '@angular/core';
import { recipe } from '../recipe.model';
import { ApiService } from '../../../../services/api/api.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-plat',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './plat.component.html',
  styleUrls: ['./plat.component.scss'],
})
export class PlatComponent implements OnInit {
  @Input() slug: string = '';
  plat: recipe[] = [];
  sanitizedIngredients: string[] = [];
  sanitizedUstensiles: string[] = [];
  sanitizedPreparation: string[] = [];

  constructor(private apiservice: ApiService) {}

  ngOnInit(): void {
    if (this.slug) {
      this.apiservice
        .getrecipe(this.slug)
        .pipe(
          catchError((error) => {
            console.error(
              'Erreur lors de la récupération de la recette',
              error
            );
            return of([] as recipe[]);
          })
        )
        .subscribe((plat: recipe[]) => {
          if (
            plat.length > 0 &&
            plat[0].ingredients &&
            plat[0].ustensiles &&
            plat[0].preparation
          ) {
            this.plat = plat;
            this.sanitizedIngredients = this.sanitizeList(plat[0].ingredients);
            this.sanitizedUstensiles = this.sanitizeList(plat[0].ustensiles);
            this.sanitizedPreparation = this.sanitizeList(plat[0].preparation);
          } else {
            console.warn('Recette invalide ou aucune recette trouvée');
          }
        });
    }
  }

  sanitizeList(items: string[]): string[] {
    return items.map((item) => (item.trim() ? item : ''));
  }
}
>>>>>>> afe05af085bf6474cb15d6eaf7a64896e5a8f91a
