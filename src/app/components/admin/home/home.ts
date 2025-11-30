import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavAdmin } from '../nav-admin/nav-admin';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NavAdmin, RouterOutlet],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {

}
