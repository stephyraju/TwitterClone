export interface Tweet {
  id: number;
  content: string;
  username: string;
  likes: number;
  retweets: number;
  comments: string[];
  fullName: string;
  date: Date;
  text: string;
  user_id: number;
}
