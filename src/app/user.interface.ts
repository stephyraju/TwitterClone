import { Tweet } from './tweet.interface';
export interface User {
  Id: number;
  bio: string;
  email: string;
  password: string;
  followersCount:number;
  following:number;
  name: string;
  username: string;
  ProfilePicture: String;
  tweets: Tweet[];
}
