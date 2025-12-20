import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { menus, createMenuPayload, AddMenuResponse, MenuResponse } from '../../models/menu.model';
import { Proverbe, ProverbeResponse } from '../../models/proverbes.model';
import { LoginResponse } from '../../models/auth.model';
import { Suggestion } from '../../models/suggestions.model';
import { Admin } from '../../models/admin.models';

@Injectable({
  providedIn: 'root',
})
export class Api {
  private baseUrl = 'http://localhost:3000/api';
  constructor(private http: HttpClient){}

  getMenu(){
    return this.http.get<menus[]>(`${this.baseUrl}/menus`);
  }

  addMenu(menu: createMenuPayload){
    return this.http.post<AddMenuResponse>(`${this.baseUrl}/menus`, menu);
  }

  updateMenu(id: number, menu: Partial<createMenuPayload>) {
    return this.http.patch<MenuResponse>(`${this.baseUrl}/menus/${id}`, menu);
  }

  removeAllMenus(){
    return this.http.delete(`${this.baseUrl}/menus`);
  }

  getProverbe(){
    return this.http.get<Proverbe | Proverbe[]>(`${this.baseUrl}/proverbes`);
  }

  addProverbe(proverbe: { type: string; content: string }) {
    return this.http.post<ProverbeResponse>(`${this.baseUrl}/proverbes`, proverbe);
  }



  createOrUpdateProverbe(proverbe: Proverbe){
    return this.http.put<Proverbe[]>(`${this.baseUrl}/proverbes/${(proverbe as any).id}`, proverbe);
  }

  login(username: string, password: string){
    const payload = {
      username: username.trim(),
      password: password.trim(),
    };
    
    return this.http.post<LoginResponse>(`${this.baseUrl}/auth/login`, payload);
  }

  getSuggestions(){
    return this.http.get<Suggestion[]>(`${this.baseUrl}/suggestions`);
  }

  addSuggestion(suggestion: { type: string; content: string }){
    return this.http.post<Suggestion>(`${this.baseUrl}/suggestions`, suggestion);
  }

  acceptSuggestion(id: number){
    return this.http.post(`${this.baseUrl}/suggestions/accept/${id}`, {});
  }

  removeSuggestion(id: number){
    return this.http.delete(`${this.baseUrl}/suggestions/${id}`);
  }

  getAdminList(){
    return this.http.get<Admin[]>(`${this.baseUrl}/admins`);
  }

  addAdmin(admin: { username: string; password: string }){
    return this.http.post<Admin>(`${this.baseUrl}/admins`, admin);
  }

  updateAdmin(id: number, admin: Partial<{ username: string; password: string }>){
    return this.http.patch<Admin>(`${this.baseUrl}/admins/${id}`, admin);
  }

  deleteAdmin(id: number){
    return this.http.delete(`${this.baseUrl}/admins/${id}`); 
  }


}
