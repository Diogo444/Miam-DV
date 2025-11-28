import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { menus } from '../../models/menu.model';
import { Proverbe } from '../../models/proverbes.model';

@Injectable({
  providedIn: 'root',
})
export class Api {
  private baseUrl = 'http://localhost:3000/api';
  constructor(private http: HttpClient){}

  getMenu(){
    return this.http.get<menus[]>(`${this.baseUrl}/menus`);
  }

  getProverbe(){
    return this.http.get<Proverbe | Proverbe[]>(`${this.baseUrl}/proverbes`);
  }

  addProverbe(proverbe: Proverbe){
    return this.http.post<Proverbe>(`${this.baseUrl}/proverbes`, proverbe);
  }

  createOrUpdateProverbe(proverbe: Proverbe){
    return this.http.put<Proverbe[]>(`${this.baseUrl}/proverbes/${(proverbe as any).id}`, proverbe);
  }

}
