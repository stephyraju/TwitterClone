// import { AuthService } from 'src/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { Tweet } from '../tweet.interface';
import { User } from '../user.interface';
import { HomeService } from '../home/home.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css'],
  animations: [
    trigger('openClose', [
      state(
        'open',
        style({
          opacity: 1,
        })
      ),
      state(
        'closed',
        style({
          opacity: 0,
        })
      ),
      transition('open => closed', [animate('2s')]),
      transition('closed => open', [animate('1s')]),
    ]),
  ],
})
export class FeedComponent implements OnInit {
  isOpen = false;
  hide = true;
  tweets: Tweet[] = [];
  newTweet = '';
  tweetText: string = '';
  submittedTweet: string = '';
  showCharacterLimitWarning: boolean = false;
  showCommentModal = false;
  loggedInUserName = '';
  loggedInUser: User | null = null;
  commentText: string = '';
  userid: string | undefined = undefined;
  errorMsg:string= "";
  username:string = "";

  constructor(
    private http: HttpClient,
    public homeService:HomeService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.userid = window.sessionStorage.getItem("id")|| '';
    console.log('userid in feed:', this.userid)

    if (this.userid) {
      this.getUsername().subscribe(() => {
        console.log('Before getFeeds: userId', this.userid);
        this.getFeeds();
        this.submitTweet();
      });
    } else {
      this.router.navigate(['/']);
    }
  }


  showComposeTweet() {
    this.isOpen = !this.isOpen;
    this.hide = !this.hide;
  }

  checkCharacterLimit() {
    if (this.submittedTweet.length > 280) {
      this.showCharacterLimitWarning = true;
    } else {
      this.showCharacterLimitWarning = false;
    }
  }
  getUsername() {
    const apiURL = `http://localhost:8080/api/auth/profile/${this.userid}`;
    return this.homeService.getRequest(apiURL);
  }


//START :: GET FEEDS DATA
getFeeds(){
  console.log('Get User and his followings Tweet List: called');
  let userId = window.sessionStorage.getItem("id")
  console.log('getFeeds: userId', userId);

  const apiUrl = `http://localhost:8080/api/auth/userAndFollowedTweets/${userId}`;
  this.homeService.getRequest(apiUrl).subscribe(
    (response: any) => { // Use the 'any' type to bypass type checking
      console.log('Get User and his followings Tweet List: successful!', response);

      // this.tweets = response.map((tweet: any) => ({ ...tweet, user_id: tweet.user_id }));

      this.tweets = response as Tweet[];
      console.log('Get User and his followings Tweet List: successful!');
      for (const tweet of this.tweets) {
        console.log('Tweet user_id:', tweet.user_id);
      }
    },
    (error: any) => {
       this.errorMsg = error.error.message;
      // Handle errors if the login fails
      console.error('Get User and his followings Tweet List:  failed!', error);
    }
  );
}

  submitTweet() {
    if (
      !this.showCharacterLimitWarning &&
      this.submittedTweet.trim().length > 0
    ) {
      if (this.submittedTweet.length <= 280) {
        const requestBody = {
          content: this.submittedTweet.trim(),
        };

        this.submittedTweet = '';
        // Call the API to submit the tweet
        const apiUrl = `http://localhost:8080/api/auth/users/${this.userid}/tweets/create`;

        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'accept': '*/*',
        });

        this.http.post(apiUrl, requestBody, { headers: headers }).subscribe(
          (response: any) => {
            const newTweet: any = {
              id: response.id, // Replace with the desired constant ID value
              content: response.content,
              username:response.username,
              user_id: this.convertToNumber(this.userid),
              likes: 0,
              comments: [],
              retweets: 0,
            };

            console.log('Tweet successful!', response);
            console.log('Tweet successful userId!', response.user_id);
            this.tweets.unshift(newTweet);
          },
          (error: any) => {

            console.error('Tweet failed!', error);
          }
        );
      } else {
        console.log('Tweet exceeds character limit');
      }
    }
  }

  selectedTweet: Tweet | null = null;

  addComment(event: { tweet: Tweet; comment: string }) {
    const { tweet, comment } = event;
    tweet.comments.push(comment);
    console.log('Number of comments:', tweet.comments.length);
    console.log('Comments:', tweet.comments);
  }
  convertToNumber(value: string | undefined): number | undefined {
    return value ? +value : undefined;
  }

}
