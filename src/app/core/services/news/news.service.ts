import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

// Interfaces opcionais — recomendo criar models depois
export interface News {
  id: string;
  title: string;
  body: string;
  created_at: string;
  like: number;
  view: number;
}

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
export class NewsService {
  private apiUrl = `${environment.apiUrl}/news`;

  constructor(private http: HttpClient) {}

  /**
   * Criar uma notícia
   * POST /news
   */
  create(payload: { title: string; body: string }): Observable<News> {
    return this.http.post<News>(this.apiUrl, payload);
  }

  /**
   * Listar notícias com paginação
   * GET /news?page=1&pageSize=10
   */
  list(page: number = 1, pageSize: number = 10): Observable<{
    data: News[];
    pagination: {
      page: number;
      pageSize: number;
      total: number;
      totalPages: number;
    };
  }> {
    const params = new HttpParams()
      .set('page', page)
      .set('pageSize', pageSize);

    return this.http.get<any>(this.apiUrl, { params });
  }

  /**
   * Buscar notícia + replies paginadas
   * GET /news/:id?page=1&pageSize=10
   */
  getById(
    newsId: string,
    page: number = 1,
    pageSize: number = 10
  ): Observable<{
    news: News;
    replies: NewsReply[];
    repliesPagination: {
      page: number;
      pageSize: number;
      total: number;
      totalPages: number;
    };
  }> {
    const params = new HttpParams()
      .set('page', page)
      .set('pageSize', pageSize);

    return this.http.get<any>(`${this.apiUrl}/${newsId}`, { params });
  }

  /**
   * Like em notícia
   * POST /news/:id/like
   */
  like(newsId: string): Observable<News> {
    return this.http.post<News>(`${this.apiUrl}/${newsId}/like`, {});
  }

}
