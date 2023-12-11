import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/services/auth.service';
import { User } from '../user.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  loggedInUser: User | null = null;

  constructor(private authService: AuthService, private router: Router) {

  }

  ngOnInit(): void {
    const userId = this.authService.getLoggedInUserId();

    if (userId) {
      // Pass the retrieved user ID to getLoggedInUser
      this.authService.getLoggedInUser(userId).subscribe(
        (user: User) => {
          this.loggedInUser = user;
        },
        (error) => {
          console.error('Error fetching logged-in user:', error);
        }
      );
    } else {
      // Handle the case where the user ID is not available
      console.error('User ID not available');
    }
  }


  logout() {
    // Call the logout method in the AuthService
    this.authService.logout();

    // After logging out, navigate to the login page
    this.router.navigate(['/login']);
  }
}
