import { Component, model, OnInit } from '@angular/core';
import { NavbarAComponent } from '../admin/navbar-a/navbar-a.component';
import { NavbarComponent } from '../public/navbar/navbar.component';
import { NavbarComponentU } from '../users/navbar/navbar.component';
import { MenuComponent } from '../public/menu/menu.component';
import { NotifComponent } from '../public/notif/notif.component';
import { ListComponent } from '../public/recettes/list/list.component';
import { AllProverbeComponent } from '../users/all-proverbe/all-proverbe.component';
import { PaletteComponent } from '../users/palette/palette.component';
import { PasswordComponent } from '../users/change/password/password.component';
import { UsernameComponent } from '../users/change/username/username.component';
import { MiammiComponent } from '../admin/miammi/miammi.component';
import { MiammiajoutComponent } from '../admin/miammiajout/miammi.component';
import { MenuajoutComponent } from '../admin/menuajout/menuajout.component';
import { AddDesignComponent } from '../admin/add-design/add-design.component';
import { AddrecipeComponent } from '../admin/addrecipe/addrecipe.component';
import { ProverbeajoutComponent } from '../admin/proverbeajout/proverbeajout.component';
import { NavigateService } from '../../services/admin/navigate/navigate.service';
import { AuthService } from '../../services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { UsersSettingsComponent } from '../admin/users-settings/users-settings.component';
import { PlatComponent } from '../public/recettes/plat/plat.component';
import { SearchbarComponent } from '../public/searchbar/searchbar.component';

@Component({
  selector: 'app-home',
  imports: [
    NavbarAComponent,
    NavbarComponent,
    NavbarComponentU,
    MenuComponent,
    NotifComponent,
    ListComponent,
    AllProverbeComponent,
    PaletteComponent,
    PasswordComponent,
    UsernameComponent,
    MiammiComponent,
    MiammiajoutComponent,
    MenuajoutComponent,
    AddDesignComponent,
    AddrecipeComponent,
    UsersSettingsComponent,
    ProverbeajoutComponent,
    PlatComponent,
    SearchbarComponent,
    CommonModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  page: string = 'menu';
  currentNavbar: string = 'public';
  selectedRecipeSlug: string = '';

  searchTerm: string = ''; // Corrigé ici

  constructor(private navigate: NavigateService, private auth: AuthService) {}

  ngOnInit(): void {
    this.auth.getRole().subscribe((role) => {
      this.currentNavbar = role;
    });

    this.navigate.page$.subscribe((currentPage) => {
      this.page = currentPage;
    });
  }

  handleSearch(terms: string): void {
    this.searchTerm = terms;
  }
  displayRecipe(slug: string): void {
    this.selectedRecipeSlug = slug;
    this.page = 'recipe';
  }
}
