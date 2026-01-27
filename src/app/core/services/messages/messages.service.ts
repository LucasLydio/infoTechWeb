import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PrivateMessage } from '../../../shared/models/message.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PrivateMessagesService {
  private apiUrl = environment.apiUrl + '/messages';

  constructor(private http: HttpClient) {}

  listInbox(page: number = 1, pageSize: number = 10): Observable<any> {
    let params = new HttpParams()
      .set('page', page)
      .set('pageSize', pageSize);

    return this.http.get<any>(`${this.apiUrl}/inbox`, { params });
  }

  /**
   * SENT - Mensagens enviadas pelo usuário autenticado
   */
  listSent(page: number = 1, pageSize: number = 10): Observable<any> {
    let params = new HttpParams()
      .set('page', page)
      .set('pageSize', pageSize);

    return this.http.get<any>(`${this.apiUrl}/sent`, { params });
  }

  /**
   * Enviar mensagem
   */
  send(payload: { to_user_id: string; body: string }): Observable<PrivateMessage> {
    return this.http.post<PrivateMessage>(this.apiUrl, payload);
  }

  /**
   * Marcar mensagem como lida
   */
  markAsRead(id: string): Observable<PrivateMessage> {
    return this.http.patch<PrivateMessage>(`${this.apiUrl}/${id}/read`, {});
  }
}
