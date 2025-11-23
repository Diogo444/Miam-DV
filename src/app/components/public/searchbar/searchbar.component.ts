<<<<<<< HEAD
import { CommonModule } from '@angular/common';
import { Component, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-searchbar',
  imports: [CommonModule, FormsModule],
  templateUrl: './searchbar.component.html',
  styleUrl: './searchbar.component.scss',
})
export class SearchbarComponent {
  searchTerms: string = '';
  search = output<string>();

  onSearch(): void {
    this.search.emit(this.searchTerms);
  }
}
=======
import { CommonModule } from '@angular/common';
import { Component, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-searchbar',
  imports: [CommonModule, FormsModule],
  templateUrl: './searchbar.component.html',
  styleUrl: './searchbar.component.scss',
})
export class SearchbarComponent {
  searchTerms: string = '';
  search = output<string>();

  onSearch(): void {
    this.search.emit(this.searchTerms);
  }
}
>>>>>>> afe05af085bf6474cb15d6eaf7a64896e5a8f91a
