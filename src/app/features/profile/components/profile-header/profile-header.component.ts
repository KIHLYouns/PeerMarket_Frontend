import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { UserProfileViewDto } from '../../../../core/services/user.service';

@Component({
  selector: 'app-profile-header',
  standalone: false,
  templateUrl: './profile-header.component.html',
  styleUrls: ['./profile-header.component.scss']
})
export class ProfileHeaderComponent implements OnInit {
  @Input() userProfile!: UserProfileViewDto;
  @Input() isOwnProfile!: boolean;

  averageRating: number = 0;
  ratingCount: number = 0;
  joinDateFormatted: string | null = '';

  constructor(private datePipe: DatePipe) {}

  ngOnInit(): void {
    if (this.userProfile) {
      this.calculateAverageRating();
      this.joinDateFormatted = this.datePipe.transform(this.userProfile.joinDate, 'longDate');
    }
  }

  calculateAverageRating(): void {
    if (this.userProfile.reviewsReceived && this.userProfile.reviewsReceived.length > 0) {
      const totalRating = this.userProfile.reviewsReceived.reduce((sum, review) => sum + review.rating, 0);
      this.averageRating = totalRating / this.userProfile.reviewsReceived.length;
      this.ratingCount = this.userProfile.reviewsReceived.length;
    } else {
      this.averageRating = 0;
      this.ratingCount = 0;
    }
  }

  onEditAvatar(): void {
    console.log('Edit avatar clicked');
    alert('Fonctionnalité de modification de l\'avatar à implémenter.');
  }

  getStarArray(rating: number): number[] {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;
    return Array(fullStars).fill(1).concat(Array(halfStar).fill(0.5)).concat(Array(emptyStars).fill(0));
  }
}