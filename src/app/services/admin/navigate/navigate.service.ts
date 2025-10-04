import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NavigateService {
  private page = new BehaviorSubject<string>('menu');
  page$ = this.page.asObservable();

  togglePage(page: string) {
    this.page.next(page);
  }

  constructor() {}
}
