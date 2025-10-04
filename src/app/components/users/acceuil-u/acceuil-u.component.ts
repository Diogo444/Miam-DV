import { Component, OnDestroy, OnInit } from '@angular/core';

import { MenuComponent } from '../../public/menu/menu.component';
import { ApiService } from '../../../services/api/api.service';
import { Subject, takeUntil } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-acceuil-u',
  imports: [MenuComponent],
  templateUrl: './acceuil-u.component.html',
  styleUrl: './acceuil-u.component.scss'
})
export class AcceuilUComponent {
  

  
  


}
