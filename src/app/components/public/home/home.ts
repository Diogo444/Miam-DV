import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Menu } from '../menu/menu';
import { NavPublic } from '../nav-public/nav-public';
import { Proverbe } from '../proverbe/proverbe';
import { Add } from '../suggestions/add/add';
import { Show } from '../suggestions/show/show';

@Component({
  selector: 'app-home',
  imports: [Menu, NavPublic, Proverbe, Add, Show],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {

}
