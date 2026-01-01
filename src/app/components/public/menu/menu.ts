import { CommonModule } from '@angular/common';
import { Component, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { Proverbe } from '../proverbe/proverbe';
import { menus } from '../../../models/menu.model';
import { Api } from '../../../services/api/api';



@Component({
  selector: 'app-menu',
  imports: [CommonModule, Proverbe],
  templateUrl: './menu.html',
  styleUrl: './menu.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Menu implements OnInit {
  // État réactif avec signals
  readonly menu = signal<menus[]>([]);
  readonly groupedMenus = signal<{ day: string; meals: menus[] }[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  constructor(private api: Api) {}

  ngOnInit(): void {
    this.getMenus();
  }

  getMenus(): void {
    this.loading.set(true);
    this.error.set(null);
    
    this.api.getMenu().subscribe({
      next: (data) => {
        this.menu.set(data);
        this.groupMenusByDay(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('[Menu] Erreur lors du chargement des menus:', err);
        this.error.set('Impossible de charger le menu. Veuillez réessayer.');
        this.loading.set(false);
      }
    });
  }

  private groupMenusByDay(menuData: menus[]): void {
    const groups = new Map<string, menus[]>();

    menuData.forEach((item) => {
      if (!groups.has(item.jour)) {
        groups.set(item.jour, []);
      }
      groups.get(item.jour)?.push(item);
    });

    this.groupedMenus.set(Array.from(groups, ([day, meals]) => ({ day, meals })));
  }
  
  retry(): void {
    this.getMenus();
  }
}
