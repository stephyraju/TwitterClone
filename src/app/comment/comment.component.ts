import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent {
  @Input() numberOfComments!: number;
  @Input() comments: { commentMsg: string }[] = [];
  showComments = false;

  toggleComments() {
    this.showComments = !this.showComments;
  }
}
