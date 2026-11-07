import { Component } from '@angular/core';
import { NotMenuProvisor } from './components/not-menu-provisor/not-menu-provisor';
// import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [NotMenuProvisor],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
