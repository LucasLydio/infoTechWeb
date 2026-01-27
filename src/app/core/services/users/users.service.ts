import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../../shared/models/user.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  /**
   * LISTAGEM PAGINADA
   * GET /users?page=1&pageSize=10
   */
  listAll(page: number = 1, pageSize: number = 10): Observable<any> {
    let params = new HttpParams()
      .set('page', page)
      .set('pageSize', pageSize);

    return this.http.get<any>(this.apiUrl, { params });
  }

  /**
   * BUSCAR USUÁRIO POR ID
   */
  getById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  /**
   * PERFIL DO USUÁRIO LOGADO
   * GET /users/me
   */
  me(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/me`);
  }

  /**
   * UPDATE – só funcionará quando existir no backend
   */
  update(id: string, payload: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, payload);
  }
}
