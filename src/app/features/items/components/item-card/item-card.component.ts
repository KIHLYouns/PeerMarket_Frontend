import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ItemCondition, ItemDto } from '../../../../core/services/item.service';

@Component({
  selector: 'app-item-card',
  standalone: false,
  templateUrl: './item-card.component.html',
  styleUrls: ['./item-card.component.scss'] // Assurez-vous que ce fichier existe
})
export class ItemCardComponent {
  @Input() item!: ItemDto;

  constructor(private router: Router) {}

  get displayImage(): string {
    return this.item.images && this.item.images.length > 0 
      ? this.item.images[0].url 
      : 'assets/images/item-placeholder.jpg';
  }

  get conditionText(): string {
    const conditionMap = {
      [ItemCondition.NEW]: 'Neuf',
      [ItemCondition.USED_LIKE_NEW]: 'Comme neuf',
      [ItemCondition.USED_GOOD]: 'Bon état',
      [ItemCondition.USED_FAIR]: 'État correct',
      [ItemCondition.USED_POOR]: 'Mauvais état'
    };
    return conditionMap[this.item.condition] || this.item.condition;
  }
     

  get ratingArray(): number[] {
    const rating = this.item.sellerAverageRating || 0;
    return Array(5).fill(0).map((_, i) => i < Math.floor(rating) ? 1 : (i < rating ? 0.5 : 0));
  }

  onCardClick(): void {
    this.router.navigate(['/items', this.item.id]);
  }

  onImageError(event: any): void {
    event.target.src = 'assets/images/item-placeholder.jpg';
  }
}
