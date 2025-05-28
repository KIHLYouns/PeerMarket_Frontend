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

  getStarArray(rating: number): number[] {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;
    return Array(fullStars).fill(1).concat(Array(halfStar).fill(0.5)).concat(Array(emptyStars).fill(0));
  }
}
