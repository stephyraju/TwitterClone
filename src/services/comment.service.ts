// src/app/comment.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  postComment(tweetId: number, userId: number, commentMsg: string): Observable<any> {
    const url = `${this.apiUrl}/api/auth/tweets/${tweetId}/${userId}/comments`;
    const commentDto = { commentMsg };
    return this.http.post(url, commentDto);
  }

  getCommentsByTweetId(tweetId: number): Observable<any> {
    const url = `${this.apiUrl}/api/auth/tweets/${tweetId}/comments`;
    return this.http.get(url);
  }
}
