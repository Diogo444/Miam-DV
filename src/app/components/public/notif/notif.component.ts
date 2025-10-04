import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../services/api/api.service';
import { Miammi } from './notif.model';
import { LoaderComponent } from '../loader/loader.component';
import { Router } from '@angular/router';


@Component({
    selector: 'app-notif',
    imports: [CommonModule, LoaderComponent],
    templateUrl: './notif.component.html',
    styleUrl: './notif.component.scss'
})
export class NotifComponent implements OnInit{
  
  message: Miammi[] = [];
loading: boolean = true;

constructor(private router: Router, private apiService: ApiService) {}

navigeTo(route: string): void {
  this.router.navigate([`/${route}`]);
}

ngOnInit(): void {
  this.apiService.getMiami().subscribe(
    (menuData: Miammi[]) => {
      this.message = menuData.sort((a, b) => b.id - a.id);
      this.message.forEach(msg => {
        // Remplacer les '\n' par des balises <br> pour que le texte ait des retours à la ligne
        msg.message = msg.message.replace(/\n/g, '<br>');
      });
      this.loading = false;
    },
    (error) => {
      console.error('Erreur lors de la récupération des données:', error);
      this.loading = false;
    }
  );
}



  

}
