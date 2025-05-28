import { Component, Input } from '@angular/core';
import { SavedItemDto } from '../../../../core/services/saved-item.service';

@Component({
  selector: 'app-user-saved-items',
  standalone: false,
  templateUrl: './user-saved-items.component.html',
  styleUrls: ['./user-saved-items.component.scss']
})
export class UserSavedItemsComponent {
  @Input() savedItems: SavedItemDto[] = [];
}
