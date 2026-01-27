import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

// Interface opcional
export interface NewsReply {
  id: string;
  news_id: string;
  user_id: string;
  body: string;
  created_at: string;
  user?: {
    id: string;
    name: string;
    avatar_url: string | null;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ReplyNewsService {
  private apiUrl = `${environment.apiUrl}/reply-news`;

  constructor(private http: HttpClient) {}

  /**
   * Cria uma resposta à notícia
   * POST /reply-news
   */
  create(newsId: string, payload: { body: string }): Observable<NewsReply> {
    const data = {
      news_id: newsId,
      body: payload.body
    };

    return this.http.post<NewsReply>(this.apiUrl, data);
  }
}
