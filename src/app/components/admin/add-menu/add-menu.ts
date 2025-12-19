import { Component } from '@angular/core';
import { Api } from '../../../services/api/api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { createMenuPayload } from '../../../models/menu.model';

@Component({
  selector: 'app-add-menu',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-menu.html',
  styleUrl: './add-menu.scss',
})
export class AddMenu {
  type: string[] = ['Blague', 'Proverbe'];
  selectedType: string = "";
  proverbe: string = "";
  jour: string[] = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
  selectedJour: string = "";
  periode: string[] = ['Déjeuner', 'Dîner'];
  selectedPeriode: string = "";
  entree: string = "";
  plat: string = "";
  fromage: string = "";
  dessert: string = "";
  successMessages: string[] = [];
  errorMessage: string | null = null;

  constructor(protected api: Api){}

  submitProverbe(){
    const payload = {
      type: this.selectedType,
      content: this.proverbe
    };
    this.api.addProverbe(payload).subscribe({
      next: (data) => {
        const message = data?.message || "Proverbe ajouté avec succès.";
        this.successMessages = [...this.successMessages, message];
        this.selectedType = "";
        this.proverbe = "";
      },
      error: (err) => {
        this.errorMessage = err?.error?.message || "Erreur lors de l'ajout du proverbe.";
      }
    });
  }

  submitMenu(){
    const menu: createMenuPayload = {
      jour: this.selectedJour,
      periode: this.selectedPeriode,
      entree: this.entree,
      plat: this.plat,
      fromage: this.fromage,
      dessert: this.dessert
    };

    this.api.addMenu(menu).subscribe({
      next: (data) => {
        const message = data?.message || "Menu ajouté avec succès.";
        this.successMessages = [...this.successMessages, message];

        if (data?.created !== false) {
          this.resetMenuFields();
        }
      },
      error: (error) => {
        this.errorMessage = error?.error?.message || "Erreur lors de l'ajout du menu.";
      }
    });
  }

  onSubmit(){
    this.resetMessages();

    const hasProverbe = this.proverbe && this.selectedType;
    const hasMenu = this.selectedJour && this.selectedPeriode;

    if (!hasProverbe && !hasMenu) {
      this.errorMessage = "Ajoutez au moins un proverbe ou un menu avant de valider.";
      return;
    }

    if(this.proverbe && this.selectedType){
      this.submitProverbe();
    }
    if(this.selectedJour && this.selectedPeriode){
      this.submitMenu();
    }

  }

  removeAllMenus(){
    this.resetMessages();

    this.api.removeAllMenus().subscribe({
      next: () => {
        this.resetMenuFields();
        this.successMessages = [...this.successMessages, "Tous les menus ont été supprimés avec succès."];
      },
      error: (error) => {
        console.error("Erreur lors de la suppression des menus :", error);
        this.errorMessage = "Erreur lors de la suppression des menus.";
      }
    });
  }

  private resetMessages(){
    this.successMessages = [];
    this.errorMessage = null;
  }

  private resetMenuFields(){
    this.selectedJour = "";
    this.selectedPeriode = "";
    this.entree = "";
    this.plat = "";
    this.fromage = "";
    this.dessert = "";
  }

}
