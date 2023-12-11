// page.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PageService {
  private pageTitle = new BehaviorSubject<string>('Welcome to Twitter');

  setPageTitle(title: string) {
    this.pageTitle.next(title);
  }

  getPageTitle() {
    return this.pageTitle.asObservable();
  }
}
