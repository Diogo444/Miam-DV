<<<<<<< HEAD
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api/api.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LocalstorageService } from '../../../services/localstorage/localstorage.service';

@Component({
  selector: 'app-palette',
  imports: [CommonModule],
  templateUrl: './palette.component.html',
  styleUrls: ['./palette.component.scss'],
})
export class PaletteComponent implements OnInit {
  designs: any[] = []; // Stockage des designs récupérés
  selectedIndex: number | null = null; // Index du design sélectionné

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.api.getAllDesigns().subscribe((data: any) => {
      this.designs = data; // Récupère les designs
    });
  }

  // Méthode pour sélectionner un design
  selectDesign(index: number): void {
    this.selectedIndex = index;
  }

  // Méthode pour valider la sélection
  validateSelection(): void {
    if (this.selectedIndex !== null) {
      const selectedDesign = this.designs[this.selectedIndex];
      const idDesign = selectedDesign.id;

      this.api.updatePreferences(idDesign).subscribe(
        () => {
          window.location.reload();
        },
        (error) => {
          console.error(error);
        }
      );
    } else {
      alert('Veuillez sélectionner un design avant de valider.');
    }
  }
}
=======
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api/api.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LocalstorageService } from '../../../services/localstorage/localstorage.service';

@Component({
  selector: 'app-palette',
  imports: [CommonModule],
  templateUrl: './palette.component.html',
  styleUrls: ['./palette.component.scss'],
})
export class PaletteComponent implements OnInit {
  designs: any[] = []; // Stockage des designs récupérés
  selectedIndex: number | null = null; // Index du design sélectionné

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.api.getAllDesigns().subscribe((data: any) => {
      this.designs = data; // Récupère les designs
    });
  }

  // Méthode pour sélectionner un design
  selectDesign(index: number): void {
    this.selectedIndex = index;
  }

  // Méthode pour valider la sélection
  validateSelection(): void {
    if (this.selectedIndex !== null) {
      const selectedDesign = this.designs[this.selectedIndex];
      const idDesign = selectedDesign.id;

      this.api.updatePreferences(idDesign).subscribe(
        () => {
          window.location.reload();
        },
        (error) => {
          console.error(error);
        }
      );
    } else {
      alert('Veuillez sélectionner un design avant de valider.');
    }
  }
}
>>>>>>> afe05af085bf6474cb15d6eaf7a64896e5a8f91a
