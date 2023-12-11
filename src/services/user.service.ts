import { Injectable } from '@angular/core';
import { Tweet } from 'src/app/tweet.interface';
import { User } from 'src/app/user.interface';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {}

  private updatedUserSubject = new BehaviorSubject<User | null>(null);
  updatedUser$ = this.updatedUserSubject.asObservable();

  updateUserData(user: User): void {
    this.updatedUserSubject.next(user);
  }

  }

