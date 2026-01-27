import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reply } from '../../../shared/models/reply.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RepliesService {
  private apiUrl = environment.apiUrl + '/reply-topics';

  constructor(private http: HttpClient) {}

  listByTopic(topicId: string): Observable<Reply[]> {
    return this.http.get<Reply[]>(`${this.apiUrl}/topic/${topicId}`);
  }

  create(topicId: string, payload: { body: string }): Observable<Reply> {
    return this.http.post<Reply>(this.apiUrl, {
      ...payload,
      topic_id: topicId,
    });
  }
}
