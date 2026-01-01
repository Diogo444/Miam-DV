import { Component, OnInit, computed, effect, signal, ChangeDetectionStrategy } from '@angular/core';
import { Api } from '../../../services/api/api';
import { menus } from '../../../models/menu.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-menu',
  imports: [FormsModule, CommonModule],
  templateUrl: './edit-menu.html',
  styleUrl: './edit-menu.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditMenu implements OnInit {
  jours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
  periodes = ['Déjeuner', 'Dîner'];
  menus = signal<menus[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  success = signal<string | null>(null);
  selectedJour = signal<string>('Lundi');
  selectedPeriode = signal<string>('Déjeuner');
  entree = '';
  plat = '';
  fromage = '';
  dessert = '';

  selectedMenu = computed(() =>
    this.menus().find(
      (menu) => menu.jour === this.selectedJour() && menu.periode === this.selectedPeriode(),
    ),
  );

  constructor(protected api: Api){
    effect(() => {
      const menu = this.selectedMenu();
      this.entree = menu?.entree || '';
      this.plat = menu?.plat || '';
      this.fromage = menu?.fromage || '';
      this.dessert = menu?.dessert || '';
    });
  }

  ngOnInit() {
    this.fetchMenus();
  }

  fetchMenus() {
    this.loading.set(true);
    this.error.set(null);

    this.api.getMenu().subscribe({
      next: (data) => {
        const list = Array.isArray(data) ? data : [];
        this.menus.set(list);

        if (list.length) {
          const current = list.find(
            (menu) =>
              menu.jour === this.selectedJour() && menu.periode === this.selectedPeriode(),
          );
          const fallback = current ?? list[0];
          this.selectedJour.set(fallback.jour);
          const periode =
            fallback.jour === 'Vendredi' && fallback.periode === 'Dîner'
              ? 'Déjeuner'
              : fallback.periode;
          this.selectedPeriode.set(periode);
        }
      },
      error: (err) => {
        console.error(err);
        this.error.set('Impossible de récupérer les menus.');
      },
      complete: () => {
        this.loading.set(false);
      },
    });
  }

  updateJour(jour: string) {
    this.success.set(null);
    this.error.set(null);
    this.selectedJour.set(jour);
    if (jour === 'Vendredi' && this.selectedPeriode() === 'Dîner') {
      this.selectedPeriode.set('Déjeuner');
    }
  }

  updatePeriode(periode: string) {
    this.success.set(null);
    this.error.set(null);
    if (this.selectedJour() === 'Vendredi' && periode === 'Dîner') {
      return;
    }
    this.selectedPeriode.set(periode);
  }

  onSubmit(){
    const currentMenu = this.selectedMenu();
    if (!currentMenu) {
      this.error.set("Aucun menu sélectionné pour cette combinaison.");
      return;
    }


    const payload = {
      entree: this.entree,
      plat: this.plat,
      fromage: this.fromage,
      dessert: this.dessert,
    };

    this.loading.set(true);
    this.error.set(null);
    this.success.set(null);

    this.api.updateMenu(currentMenu.id, payload).subscribe({
      next: (res) => {
        const updatedMenu = res?.menu;
        const message = res?.message || 'Menu modifié avec succès.';
        this.success.set(message);

        if (updatedMenu) {
          this.menus.update((items) =>
            items.map((menu) =>
              menu.id === updatedMenu.id
                ? updatedMenu
                : menu
            ),
          );
        }
      },
      error: (err) => {
        console.error(err);
        this.error.set(err?.error?.message || "Impossible de modifier le menu.");
      },
      complete: () => {
        this.loading.set(false);
      },
    });
  }
}
