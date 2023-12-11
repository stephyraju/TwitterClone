
import { Injectable } from '@angular/core';
import { User } from 'src/app/user.interface';// Import the User interface
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { catchError} from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  setLoggedInUser(userId: string): void {

  }

  getLoggedInUserId(): string | null {
    // You can add any necessary logic here if needed
    return window.sessionStorage.getItem('id');
  }

  getLoggedInUser(userId: string): Observable<User> {
    console.log('userId from auth service:', userId);

    if (!userId) {
      return throwError('User ID not available');
    }

    const apiURL = `http://localhost:8080/api/auth/profile/${userId}`;
    console.log('apiURL:', apiURL);

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });

    return this.http.get<User>(apiURL, { headers }).pipe(
      catchError((error: any) => {
        console.error('Error fetching user data:', error);
        return throwError(error);
      })
    );
  }

  logout(): void {
    // Clear user-related data
    localStorage.removeItem('token');
  }
}
