import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { PageService } from 'src/services/page.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../user.interface';
import { Tweet } from '../tweet.interface';
import { SelectedUserService } from 'src/services/selectedUser.service';
import { UserService } from 'src/services/user.service';
import { HomeService } from '../home/home.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent implements OnInit {
  // loggedInUser: User | null = null;
  isEditMode: boolean = false;
  editedName: string = ''; // To store the edited name
  selectedUsername: string | null = null;
  selectedUser: User | null = null;
  tweets: Tweet[] = [];
  likedTweets: Tweet[] = [];
  retweetedTweets: Tweet[] = [];
  otherUsers: User[] = [];
  isFollowing: boolean = false;
  registration: FormGroup;
  userid:any;
  baseURL: string = '';
  user: User = {} as User;
  error:string = "";
  errorMsg:string= "";
  success:string ="";
  searchQuery: string = "";
  showSearchHint: boolean = false;
  enableEdit:boolean = false;
  viewProfileUserId: string | null = null;

  constructor(
    private pageService: PageService,
    private cdr: ChangeDetectorRef,

    private formBuilder: FormBuilder,
    private http: HttpClient,
    public homeService: HomeService,
    private router: Router,
    private userService: UserService,
    private route: ActivatedRoute,
    private selectedUserService: SelectedUserService

  )
  { this.registration = this.formBuilder.group({
    name: ['', Validators.required],
    bio: ['', Validators.required],
  });}

  ngOnInit(): void {
    this.baseURL = window.sessionStorage.getItem('baseURL') as string;
    // this.userid = window.sessionStorage.getItem("id");
    this.userid = this.viewProfileUserId || window.sessionStorage.getItem('id');
    if (this.userid) {
      console.log('Userid usecomponent:', this.userid);
      this.getUserData(this.userid);
      this.loadTweets();
      this.pageService.setPageTitle('Profile');
    } else {
      console.error('Userid is null or undefined');
    }
  }
  toggleFollow(): void {
    if (this.selectedUser) {
      this.isFollowing = !this.isFollowing;
    }
  }

    loadTweets(): void {
      let userId = window.sessionStorage.getItem("id")
      const apiUrl = `http://localhost:8080/api/auth/profile/${userId}/ListOfOwnTweets`;

      // Make the HTTP GET request
      this.homeService.getRequest<Tweet[]>(apiUrl).subscribe(
        (response: Tweet[]) => {
          console.log('Get User Tweet List: successful!', response);
          this.tweets = response;
        },
        (error: any) => {
          this.errorMsg = error.error.message;
          // Handle errors if the login fails
          console.error('Get User Tweet List:  failed!', error);
        }
      );
    }


    updateUserdata(): void {
      if (this.registration.invalid) {
        return;
      }

      const name = this.registration.value.name;
      const bio = this.registration.value.bio;

      const apiUrl = `http://localhost:8080/api/auth/profile/${this.userid}`;

      // Create the request body
      const requestBody = {
        name : name,
        bio : bio,
        profilePicture : "test"
      };

      // Set the headers (if required by your API)
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'accept': '*/*'
      });

      // Make the HTTP POST request
      this.http.put(apiUrl, requestBody, { headers: headers }).subscribe(
        (response: any) => {
          console.log('Update user data:  successful!', response);
          this.userService.updateUserData(response);
          this.enableEdit = false;
          // this.router.navigate(['/']);
          this.getUserData(this.userid);
          this.enableEdit = false;
        },
        (error: any) => {
          // Handle errors if the register fails
          console.error('Update user data: failed!', error);
          if(error.status == 200){
            this.router.navigate(['/']);
          }
          // Perform any other error handling actions
        }
      );
    }
    updateEdit(val:boolean){

      this.enableEdit = val;

    }
    // viewUserProfileWhenUsernameExist() {
    //   if (this.tweets && this.tweets.length > 0 && this.tweets[0].user_id) {
    //     // For simplicity, I'm assuming the user_id is the same for all tweets.
    //     // You might need to adjust this based on your data structure.
    //     this.viewProfileUserId = this.tweets[0].user_id.toString();
    //     this.viewUserProfile(this.tweets[0].user_id);
    //   }
    // }

    // viewUserProfile(userId: number): void {
    //   this.selectedUserService.setSelectedUserId(userId);
    //   console.log('userId in viewUserProfile:', userId);

    //   // Set the temporary viewProfileUserId
    //   this.viewProfileUserId = userId.toString();

    //   // Continue with other logic if needed
    //   this.getUserData(this.userid);
    //   this.router.navigate(['/user', userId]);
    // }


    getUserData(userId: number): void {
      console.log('getUserData: Current UserID:', userId);
      let apiURL = `http://localhost:8080/api/auth/profile/${userId}`;

      console.log('getUserdata:', userId);

      this.homeService.getRequest<User>(apiURL).subscribe(
        (res) => {
          if (res) {
            console.log('API Response:', res);
            this.user = res;
            console.log('User Object:', this.user.username);
          }
        },
        (error) => {
          console.log(error);
        }
      );
    }

    // getUserData() {
    //   console.log('getUserData: Current UserID:', this.userid);
    //   let apiURL = `http://localhost:8080/api/auth/profile/${this.userid}`;

    //   console.log('getUserdata:', this.userid);

    //   return this.homeService.getRequest<User>(apiURL).subscribe(
    //     (res) => {
    //       if (res) {
    //         console.log('API Response:', res);
    //         this.user = res;
    //         console.log('User Object:', this.user.username);
    //       }
    //     },
    //     (error) => {
    //       console.log(error);
    //     }
    //   );
    //   }

      // viewUserProfile(userId: number): void {
      //   this.selectedUserService.setSelectedUserId(userId);
      //   console.log('userId in viewUserProfile:', userId);

      //   // Update the session storage with the new userId
      //   window.sessionStorage.setItem("id", userId.toString());

      //   this.userid = userId.toString();
      //   this.getUserData();
      //   this.router.navigate(['/user', userId]);
      // }


  }
