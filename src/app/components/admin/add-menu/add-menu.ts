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

  constructor(protected api: Api){}

  submitProverbe(){
    console.log(this.selectedType);
    console.log(this.proverbe);
    const payload = {
      type: this.selectedType,
      content: this.proverbe
    };
    this.api.addProverbe(payload).subscribe({
      next: (data) => {
        console.log("Proverbe ajouté :", data);
        this.selectedType = "";
        this.proverbe = "";
      },
      error: (err) => console.error(err)
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
        console.log("Menu ajouté avec succès :", data);
        // reset les champs
        this.selectedJour = "";
        this.selectedPeriode = "";
        this.entree = "";
        this.plat = "";
        this.fromage = "";
        this.dessert = "";
        this.selectedPeriode = '';
        this.selectedJour = '';
      },
      error: (error) => {
        console.error("Erreur lors de l'ajout du menu :", error);
      }
    });
  }

  onSubmit(){
    if(this.proverbe && this.selectedType){
      console.log("proverbe");

      this.submitProverbe();
    }
    if(this.selectedJour && this.selectedPeriode){
      console.log("menu");
      this.submitMenu();
    }

  }

  removeAllMenus(){
    this.api.removeAllMenus().subscribe({
      next: () => {
        // reset les champs
        this.selectedJour = "";
        this.selectedPeriode = "";
        this.entree = "";
        this.plat = "";
        this.fromage = "";
        this.dessert = "";
      },
      error: (error) => {
        console.error("Erreur lors de la suppression des menus :", error);
      }
    });
  }

}
