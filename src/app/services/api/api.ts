import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { menus } from '../../models/menu.model';

@Injectable({
  providedIn: 'root',
})
export class Api {
  private baseUrl = 'http://localhost:3000/api';
  constructor(private http: HttpClient){}

  getMenu(){
    return this.http.get<menus[]>(`${this.baseUrl}/menus`);
  }

}
