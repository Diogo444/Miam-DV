import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Menu } from '../../components/public/menu/menu.model';
import { Miammi } from '../../components/public/notif/notif.model';
import { Proverbe } from '../../components/public/menu/proverbe.model';
import { recipe } from '../../components/public/recettes/recipe.model';
import { Users } from '../../components/admin/users-settings/Users.model';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  getMenu(): Observable<Menu[]> {
    return this.http.get<Menu[]>(`/api/menu`);
  }

  MenuAjout(menu: Menu): Observable<any> {
    return this.http.post(`/api/menuajout`, menu);
  }

  menuvider() {
    return this.http.delete(`/api/menufinal`);
  }

  getProverbe(): Observable<Proverbe[]> {
    return this.http.get<Proverbe[]>(`/api/proverbe`);
  }
  getAllProverbe(): Observable<Proverbe[]> {
    return this.http.get<Proverbe[]>(`/api/allProverbe`);
  }

  ProverbeAjout(proverbe: string) {
    return this.http.post(`/api/proverbeajout`, proverbe);
  }

  getMiami(): Observable<Miammi[]> {
    return this.http.get<Miammi[]>(`/api/miammi`);
  }

  MiammiAjout(messagedata: string): Observable<any> {
    return this.http.post(`/api/miammiajout`, { message: messagedata });
  }

  deletemessage(id: number) {
    return this.http.delete(`/api/deletemsg/${id}`);
  }

  deleteallmessage() {
    return this.http.delete(`/api/deletemiammi`);
  }

  getrecipelist() {
    return this.http.get<recipe[]>(`/api/recipes`);
  }

  getrecipe(slug: string): Observable<recipe[]> {
    return this.http.get<recipe[]>(`/api/recipe/${slug}`);
  }

  rec(formData: FormData) {
    return this.http.post(`/api/recipeajout`, formData);
  }

  register(name: string, password: string) {
    return this.http.post<any>(`/auth/register`, {
      name: name,
      password: password,
      withCrendentials: true,
    });
  }
  login(username: string, password: string) {
    return this.http.post<any>(`/auth/login`, {
      name: username,
      password: password,
      withCrendentials: true,
    });
  }

  change_username(username: string, token: string) {
    return this.http.post<any>(`/auth/change-username`, {
      newUsername: username,
      token: token,
    });
  }

  change_password(password: string, token: string) {
    return this.http.post<any>(`/auth/change-password`, {
      newPassword: password,
      token: token,
    });
  }

  delete_account() {
    return this.http.delete<any>(`/auth/delete-account/`, {
      withCredentials: true,
    });
  }
  signup(name: string, password: string) {
    return this.http.post<any>(`/auth/signup`, {
      name: name,
      password: password,
    });
  }

  getPreferences() {
    return this.http.post<any>(`/api/getPreferences`, {
      withCredentials: true,
    });
  }

  getAllDesigns() {
    return this.http.get<any>(`/api/allPreferences`);
  }
  updatePreferences(idDesign: number) {
    return this.http.post<any>(
      `/api/updatePreferences`,
      { idDesign },
      { withCredentials: true }
    );
  }

  addDesign(bg: string, title: string, element: string) {
    return this.http.post<any>(`/api/addDesign`, { bg, title, element });
  }

  selectAllUsers(): Observable<Users[]> {
    return this.http.get<Users[]>(`/auth/all-users`, { withCredentials: true });
  }

  deleteUser(id: number) {
    return this.http.delete<any>(`auth/delete-user/${id}`, {
      withCredentials: true,
    });
  }

  updatePasswordUser(id: number, newPassword: string) {
    return this.http.patch<{ message: string }>(
      `/auth/update-user-passwd/${id}`,
      { newPassword }, // ⬅️ Correction du nom du champ envoyé
      { withCredentials: true }
    );
  }
  updateRoleUser(id: number, newRole: string) {
    return this.http.patch<{ message: string }>(
      `/auth/update-user-role/${id}`,
      { role: newRole }, // ⬅️ Correction du nom du champ envoyé
      { withCredentials: true }
    );
  }
}
