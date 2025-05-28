import { Component, Input } from '@angular/core';
import { ItemDto } from '../../../../core/services/item.service';

@Component({
  selector: 'app-user-items-list',
  standalone: false,
  templateUrl: './user-items-list.component.html',
  styleUrls: ['./user-items-list.component.scss']
})
export class UserItemsListComponent {
  @Input() items: ItemDto[] = [];
}
