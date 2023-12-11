import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// import { AuthService } from 'src/services/auth.service';
import { User } from '../user.interface';


@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent implements OnInit {
  selectedUserName: string | null = null;
  loggedInUser: User | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,

  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.selectedUserName = params.get('username');
    });

    // Get the logged-in user
    // this.loggedInUser = this.authService.getLoggedInUser();
  }

  goBackToMyProfile(): void {
    // Checking if the user is logged in before navigating back to the profile
    if (this.loggedInUser) {
      this.router.navigateByUrl('/user' + this.loggedInUser.name);
    }
  }
}
