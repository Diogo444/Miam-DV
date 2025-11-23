import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Proverbe } from '../proverbe/proverbe';
import { menus } from '../../../models/menu.model';
import { Api } from '../../../services/api/api';



@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, Proverbe],
  templateUrl: './menu.html',
  styleUrl: './menu.scss',
})
export class Menu implements OnInit {
  menu: menus[] = [];
  groupedMenus: { day: string; meals: menus[] }[] = [];

  constructor(private api: Api) {}

  ngOnInit(): void {
    this.getMenus();
  }

  getMenus() {
    this.api.getMenu().subscribe((data) => {
      this.menu = data;
      this.groupMenusByDay();
    });
  }

  private groupMenusByDay() {
    const groups = new Map<string, menus[]>();

    this.menu.forEach((item) => {
      if (!groups.has(item.jour)) {
        groups.set(item.jour, []);
      }
      groups.get(item.jour)?.push(item);
    });

    this.groupedMenus = Array.from(groups, ([day, meals]) => ({ day, meals }));
  }
}
