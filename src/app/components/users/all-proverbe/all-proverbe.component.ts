<<<<<<< HEAD
import { CommonModule, DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { LoaderComponent } from '../../public/loader/loader.component';
import { Proverbe } from '../../public/menu/proverbe.model';
import { ApiService } from '../../../services/api/api.service';

@Component({
  selector: 'app-all-proverbe',
  imports: [CommonModule, LoaderComponent],
  templateUrl: './all-proverbe.component.html',
  styleUrls: ['./all-proverbe.component.scss'],
  providers: [DatePipe],
})
export class AllProverbeComponent implements OnInit {
  allProverbe: Proverbe[] = [];
  loading: boolean = true;

  @Input() searchTerm: string = ''; // Permet de recevoir la recherche depuis le parent

  constructor(private api: ApiService, private datePipe: DatePipe) {}

  ngOnInit(): void {
    this.api.getAllProverbe().subscribe(
      (data) => {
        this.loading = false;
        this.allProverbe = data
          .map((item) => {
            return {
              ...item,
              created_at: item.created_at
                ? this.datePipe.transform(item.created_at, 'dd/MM/yyyy')
                : null,
            };
          })
          .sort((a, b) => b.id - a.id); // Tri des proverbes par ID décroissant
      },
      (error) => {
        console.error('Erreur lors de la récupération des proverbes :', error);
      }
    );
  }

  // Getter pour filtrer les proverbes en fonction de searchTerm
  get filteredProverbe(): Proverbe[] {
    return this.allProverbe.filter((proverbe) =>
      proverbe.proverbe.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}
=======
import { CommonModule, DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { LoaderComponent } from '../../public/loader/loader.component';
import { Proverbe } from '../../public/menu/proverbe.model';
import { ApiService } from '../../../services/api/api.service';

@Component({
  selector: 'app-all-proverbe',
  imports: [CommonModule, LoaderComponent],
  templateUrl: './all-proverbe.component.html',
  styleUrls: ['./all-proverbe.component.scss'],
  providers: [DatePipe],
})
export class AllProverbeComponent implements OnInit {
  allProverbe: Proverbe[] = [];
  loading: boolean = true;

  @Input() searchTerm: string = ''; // Permet de recevoir la recherche depuis le parent

  constructor(private api: ApiService, private datePipe: DatePipe) {}

  ngOnInit(): void {
    this.api.getAllProverbe().subscribe(
      (data) => {
        this.loading = false;
        this.allProverbe = data
          .map((item) => {
            return {
              ...item,
              created_at: item.created_at
                ? this.datePipe.transform(item.created_at, 'dd/MM/yyyy')
                : null,
            };
          })
          .sort((a, b) => b.id - a.id); // Tri des proverbes par ID décroissant
      },
      (error) => {
        console.error('Erreur lors de la récupération des proverbes :', error);
      }
    );
  }

  // Getter pour filtrer les proverbes en fonction de searchTerm
  get filteredProverbe(): Proverbe[] {
    return this.allProverbe.filter((proverbe) =>
      proverbe.proverbe.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}
>>>>>>> afe05af085bf6474cb15d6eaf7a64896e5a8f91a
