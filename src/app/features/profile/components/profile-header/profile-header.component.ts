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

  getDefaultAvatar(event: Event, username?: string): void {
    const target = event.target as HTMLImageElement;
    const name = username || 'Default User';

    const encodedName = encodeURIComponent(name.trim()).replace(/%20/g, '+');
    target.src = `https://ui-avatars.com/api/?name=${encodedName}&color=000&size=128`;
    target.onerror = null; // Prevents infinite error loops
  }
}