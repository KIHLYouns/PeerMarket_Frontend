import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ItemDto, ItemService } from '../../../core/services/item.service';

@Component({
  selector: 'app-item-detail',
  standalone: false,
  templateUrl: './item-detail.component.html',
  styleUrls: ['./item-detail.component.scss']
})
export class ItemDetailComponent implements OnInit, OnDestroy {
  item: ItemDto | null = null;
  loading = false;
  error: string | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private itemService: ItemService
  ) {}

  ngOnInit(): void {
    this.route.params.pipe(
      takeUntil(this.destroy$)
    ).subscribe(params => {
      const itemId = params['id'];
      if (itemId) {
        this.loadItem(+itemId);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadItem(id: number): void {
    this.loading = true;
    this.error = null;
    
    this.itemService.getItemById(id).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (item) => {
        this.item = item;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Article non trouvé';
        this.loading = false;
        console.error('Error loading item:', error);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/items']);
  }
}
