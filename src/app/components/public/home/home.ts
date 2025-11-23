import { Component } from '@angular/core';
import { Menu } from '../menu/menu';
import { NavPublic } from '../nav-public/nav-public';

@Component({
  selector: 'app-home',
  imports: [Menu, NavPublic],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {

}
