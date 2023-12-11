import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/services/auth.service';
import { User } from '../user.interface';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  loggedInUser: User | null = null;

  constructor(
    private userService: UserService, private authService: AuthService) {}

  ngOnInit(): void {
    const userId = this.authService.getLoggedInUserId();
    if (userId) {
      // Pass the retrieved user ID to getLoggedInUser
      this.authService.getLoggedInUser(userId).subscribe(
        (user: User) => {
          this.loggedInUser = user;
          console.log('Logged in user in profile:', this.loggedInUser);
        },
        (error) => {
          console.error('Error fetching logged-in user in profile:', error);
        }
      );
    } else {
      // Handle the case where the user ID is not available
      console.error('User ID not available in profile');
    }

    console.log('Logged in user in profile:', this.loggedInUser);

    this.userService.updatedUser$.subscribe((updatedUser: any) => {
      console.log('Updated user data in profile component:', updatedUser);
      if (updatedUser) {
        this.loggedInUser = updatedUser;
      }
    });
  }
}
