import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CategoryService, CategoryDto } from '../../../../core/services/category.service';

@Component({
  selector: 'app-category-filter',
  standalone: false,
  templateUrl: './category-filter.component.html',
  styleUrls: ['./category-filter.component.scss']
})
export class CategoryFilterComponent implements OnInit {
  @Input() selectedCategoryId: number | null = null;
  @Output() categoryChange = new EventEmitter<number | null>();

  categories: CategoryDto[] = [];
  loading = false;

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading = true;
    this.categoryService.getAllCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.loading = false;
      }
    });
  }

  onCategoryClick(categoryId: number | null): void {
    this.selectedCategoryId = this.selectedCategoryId === categoryId ? null : categoryId;
    this.categoryChange.emit(this.selectedCategoryId);
  }

  isActive(categoryId: number | null): boolean {
    return this.selectedCategoryId === categoryId;
  }
}
