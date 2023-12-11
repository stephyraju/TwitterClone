import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  constructor(private http:HttpClient){

  }

  getHeader(){
    let userid = window.sessionStorage.getItem('id')
    let token = window.sessionStorage.getItem('token')
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'accept': '*/*',
      'Authorization' :`Bearer ${token}`
    });
  }

  postRequest(url: string, body: any){
    return this.http.post(url,body,{ headers: this.getHeader() }).subscribe();
  }

  getRequest<T>(url: string): Observable<T> {
    return this.http.get<T>(url, { headers: this.getHeader() });
  }

}
