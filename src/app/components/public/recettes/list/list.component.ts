<<<<<<< HEAD
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ApiService } from '../../../../services/api/api.service';
import { recipe } from '../recipe.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-list',
  imports: [CommonModule],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  recipes: recipe[] = [];
  filteredRecipes: recipe[] = [];

  @Input() searchTerm: string = ''; // Correction ici
  @Output() selectRecipe = new EventEmitter<string>();

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getrecipelist().subscribe((recipes: recipe[]) => {
      this.recipes = recipes.sort((a, b) => b.id - a.id);
      this.filteredRecipes = [...this.recipes]; // Initialisation
    });
  }

  ngOnChanges(): void {
    this.filterRecipes();
  }

  filterRecipes(): void {
    if (!this.searchTerm) {
      this.filteredRecipes = [...this.recipes];
    } else {
      this.filteredRecipes = this.recipes.filter((recipe) =>
        recipe.nom.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  showrecipe(slug: string) {
    this.selectRecipe.emit(slug);
  }
}
=======
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ApiService } from '../../../../services/api/api.service';
import { recipe } from '../recipe.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-list',
  imports: [CommonModule],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  recipes: recipe[] = [];
  filteredRecipes: recipe[] = [];

  @Input() searchTerm: string = ''; // Correction ici
  @Output() selectRecipe = new EventEmitter<string>();

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getrecipelist().subscribe((recipes: recipe[]) => {
      this.recipes = recipes.sort((a, b) => b.id - a.id);
      this.filteredRecipes = [...this.recipes]; // Initialisation
    });
  }

  ngOnChanges(): void {
    this.filterRecipes();
  }

  filterRecipes(): void {
    if (!this.searchTerm) {
      this.filteredRecipes = [...this.recipes];
    } else {
      this.filteredRecipes = this.recipes.filter((recipe) =>
        recipe.nom.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  showrecipe(slug: string) {
    this.selectRecipe.emit(slug);
  }
}
>>>>>>> afe05af085bf6474cb15d6eaf7a64896e5a8f91a
