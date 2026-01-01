import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavAdmin } from '../nav-admin/nav-admin';

@Component({
  selector: 'app-home',
  imports: [NavAdmin, RouterOutlet],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {

}
