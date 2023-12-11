// header.component.ts
import { Component, OnInit } from '@angular/core';
import { PageService } from 'src/services/page.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  pageName: string = 'Welcome to Twitter';

  constructor(private pageService: PageService) {}

  ngOnInit() {
    this.pageService.getPageTitle().subscribe((title) => {
      this.pageName = title;
    });
  }
}
