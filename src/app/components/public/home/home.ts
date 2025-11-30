import { Component } from '@angular/core';
import { Menu } from '../menu/menu';
import { NavPublic } from '../nav-public/nav-public';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [Menu, NavPublic],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {

}
