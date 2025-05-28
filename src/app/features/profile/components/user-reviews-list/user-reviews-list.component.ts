import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ReviewDto } from '../../../../core/services/review.service';

@Component({
  selector: 'app-user-reviews-list',
  standalone: false,
  templateUrl: './user-reviews-list.component.html',
  styleUrls: ['./user-reviews-list.component.scss']
})
export class UserReviewsListComponent implements OnInit {
  @Input() reviews: ReviewDto[] = [];
  @Input() reviewType: 'received' | 'given' = 'received';

  title: string = '';

  constructor(public datePipe: DatePipe) {}

  ngOnInit(): void {
    this.title = this.reviewType === 'received' ? 'Avis Reçus' : 'Avis Donnés';
  }
}
