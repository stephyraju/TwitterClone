import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SelectedUserService {
  private selectedUsername: string | null = null;
  // private selectedUserId: number | null = null;
  private selectedUserId: Subject<number | null> = new Subject<number | null>();

  setSelectedUsername(username: string): void {
    this.selectedUsername = username;
  }

  getSelectedUsername(): string | null {
    return this.selectedUsername;
  }

  // setSelectedUserId(userId: number): void {
  //   this.selectedUserId = userId;

  //   console.log('userId in setSelectedUserId:', userId);
  // }
   setSelectedUserId(userId: number): void {
    this.selectedUserId.next(userId);
  }

  getSelectedUserId(): Observable<number | null> {
    return this.selectedUserId.asObservable();
  }
  // getSelectedUserId(): number | null {
  //   return this.selectedUserId;
  // }
}
