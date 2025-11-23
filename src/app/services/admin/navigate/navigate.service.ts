<<<<<<< HEAD
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
=======
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
>>>>>>> afe05af085bf6474cb15d6eaf7a64896e5a8f91a
