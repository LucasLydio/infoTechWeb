import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TopicsService {
  private apiUrl = `${environment.apiUrl}/topics`;

  constructor(private http: HttpClient) {}

  /**
   * Lista tópicos com paginação do backend
   */
  list(page: number = 1, pageSize: number = 10): Observable<any> {
    let params = new HttpParams()
      .set('page', page)
      .set('pageSize', pageSize);

    return this.http.get<any>(this.apiUrl, { params });
  }

  /**
   * Obtém um tópico com replies paginadas
   */
  getById(id: string, page: number = 1, pageSize: number = 10): Observable<any> {
    let params = new HttpParams()
      .set('page', page)
      .set('pageSize', pageSize);

    return this.http.get<any>(`${this.apiUrl}/${id}`, { params });
  }

  /**
   * Cria um novo tópico
   */
  create(payload: { title: string; body: string }): Observable<any> {
    return this.http.post<any>(this.apiUrl, payload);
  }
}
