import { Component } from '@angular/core';
import { PageService } from 'src/services/page.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  constructor(private pageService: PageService) {}

  ngOnInit() {
    this.pageService.setPageTitle('Home');
  }
}
