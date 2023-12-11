import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Tweet } from '../tweet.interface';
import { Router } from '@angular/router';
import { UserService } from 'src/services/user.service';
import { SelectedUserService } from 'src/services/selectedUser.service';
import { CommentService } from 'src/services/comment.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-tweet',
  templateUrl: './tweet.component.html',
  styleUrls: ['./tweet.component.css'],
})
export class TweetComponent {
  @Input() tweet: Tweet | undefined;
  @Output() addComment = new EventEmitter<{ tweet: Tweet; comment: string }>();
  @Input() fullName: string = '';
  comments: { commentMsg: string }[] = [];
  @Input() userId?: number;


  tweetLiked: boolean = false;

  constructor(
    private router: Router,
    private userService: UserService,
    private selectedUserService: SelectedUserService,
    private commentService: CommentService,
    private http: HttpClient
  ) {}


  ngOnInit(): void {

    console.log('Received tweet data:', this.tweet);
    console.log('Received tweet data - username:', this.tweet?.username);
    console.log('Received tweet data - userId:', this.tweet?.user_id);

  }

  getTimeSince(date: Date | undefined): string {
    if (date) {
      const currentDate = new Date();
      const timeDiff = Math.abs(currentDate.getTime() - date.getTime());
      const minutes = Math.floor(timeDiff / 60000);
      if (minutes < 1) {
        return 'just now';
      } else if (minutes < 60) {
        return `${minutes} minutes ago`;
      } else {
        const hours = Math.floor(minutes / 60);
        if (hours < 24) {
          return `${hours} hours ago`;
        } else {
          const days = Math.floor(hours / 24);
          return `${days} days ago`;
        }
      }
    }
    return '';

  }
  likeTweet() {
    if (this.tweet && !this.tweetLiked) {
      let tweetId = this.tweet.id;
      const requestBody = {};

      // Set the headers (if required by your API)
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'accept': '*/*'
      });

      const apiUrl = `http://localhost:8080/api/auth/likes/${tweetId}/${this.userId}`;

      this.http.post(apiUrl, requestBody, { headers: headers }).subscribe(
        (response: any) => {
          console.log('Like dislike successful!', response);
          if (this.tweet && response.liked != undefined) {
            if (response.liked) {
              this.tweet.likes++;
              this.tweetLiked = true;
            } else {
              this.tweet.likes--;
              this.tweetLiked = false;
            }
          }
        },
        (error: any) => {
          // Handle errors if the register fails
          console.error('Like action failed!', error);
        }
      );
    } else {
      console.log('Tweet already liked or user has already liked a tweet.');
    }
  }

  retweetTweet() {
    if (this.tweet) {
      this.tweet.retweets++;
    }
  }

  showCommentBox = false;
  newComment: string = '';
  // comments: { text: string }[] = [];



  postComment() {
    if (this.tweet && this.newComment.trim() !== '') {
      console.log('userId before postComment:', this.userId);

      if (!this.userId) {
        console.error('userId is undefined or not set.');
        return;
      }

      this.commentService.postComment(this.tweet.id, this.userId, this.newComment).subscribe(() => {
        this.getComments();
      });

      this.newComment = '';
      this.showCommentBox = false;
    }
  }


  getComments() {
    if (this.tweet) {
      this.commentService.getCommentsByTweetId(this.tweet.id).subscribe((comments) => {
        console.log('API Response - Comments:', comments);
        this.comments = comments;
        console.log('Updated comments:', this.comments);
      });
    }
  }

  viewUserProfile(userId: number | undefined): void {
    if (userId) {
      this.selectedUserService.setSelectedUserId(userId);
      this.router.navigate(['/user', userId]);
    }
  }
  // viewUserProfileWhenUsernameExist() {
  //   if (this.tweet?.user_id) {
  //     console.log('Tweet object:', this.tweet);
  //     this.viewUserProfile(this.tweet.user_id);
  //     console.log('userId in viewUserProfileWhenUsernameExist:', this.tweet.user_id);
  //   }
  // }
  // viewUserProfile(userId: number) {
  //   this.selectedUserService.setSelectedUserId(userId);
  //   console.log('userId in viewUserProfile:', userId);
  //   this.router.navigate(['/user', userId]);
  // }
}
