import { Component, OnDestroy, OnInit } from '@angular/core';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { CityDto, CityService } from '../../../../core/services/city.service';
import { ItemDto, ItemService } from '../../../../core/services/item.service';

@Component({
  selector: 'app-item-list',
  standalone: false,
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss']
})
export class ItemListComponent implements OnInit, OnDestroy {
  items: ItemDto[] = [];
  filteredItems: ItemDto[] = [];
  loading = false;
  error: string | null = null;
  
  // Filtres
  selectedCategoryId: number | null = null;
  selectedCityId: number | null = null;
  sortBy: string = 'recentItemsStrategy';
  searchTerm: string = '';
  
  cities: CityDto[] = [];
  
  sortOptions = [
    { value: 'recentItemsStrategy', label: 'Récemment ajoutés' },
    { value: 'mostViewedItemsStrategy', label: 'Plus consultés' },
    { value: 'highestRatedItemsStrategy', label: 'Mieux notés' }
  ];

  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();

  constructor(
    private itemService: ItemService,
    private cityService: CityService
  ) {
    // Recherche avec debounce
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(term => {
      this.searchTerm = term;
      this.applyFilters();
    });
  }

  ngOnInit(): void {
    this.loadCities();
    this.loadItems();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadCities(): void {
    this.cityService.getAllCities().pipe(takeUntil(this.destroy$)).subscribe({
      next: (cities) => {
        this.cities = cities;
      },
      error: (err) => {
        console.error('Error loading cities', err);
      }
    });
  }

  loadItems(): void {
    this.loading = true;
    this.error = null;
    
    this.itemService.getItemSuggestions(this.sortBy).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (items) => {
        this.items = items;
        this.loading = false;
        this.applyFilters();
      },
      error: (error) => {
        this.error = 'Erreur lors du chargement des articles';
        this.loading = false;
        console.error('Error loading items:', error);
      }
    });
  }

  onCategoryChange(categoryId: number | null): void {
    this.selectedCategoryId = categoryId;
    this.applyFilters();
  }

  onCityChange(cityId: string | null): void {
    this.selectedCityId = cityId ? parseInt(cityId, 10) : null;
    this.applyFilters();
  }

  onSearch(term: string): void {
    this.searchSubject.next(term);
  }

  onSortChange(sortBy: string): void {
    this.sortBy = sortBy;
    this.loadItems();
  }

  clearFilters(): void {
    this.selectedCategoryId = null;
    this.selectedCityId = null;
    this.searchTerm = '';
    // Réinitialiser l'input de recherche dans le template si nécessaire
    const searchInput = document.querySelector('.search-input') as HTMLInputElement;
    if (searchInput) {
      searchInput.value = '';
    }
    this.applyFilters();
  }

  private applyFilters(): void {
    let filtered = [...this.items];

    // Filtre par catégorie
    if (this.selectedCategoryId) {
      filtered = filtered.filter(item => item.categoryId === this.selectedCategoryId);
    }

    // Filtre par ville
    if (this.selectedCityId) {
      filtered = filtered.filter(item => item.sellerCityId === this.selectedCityId);
    }

    // Recherche par titre
    if (this.searchTerm) {
      const searchTermLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchTermLower) ||
        (item.description && item.description.toLowerCase().includes(searchTermLower))
      );
    }

    this.filteredItems = filtered;
  }

  // Ajouté pour *ngFor trackBy
  trackByItemId(index: number, item: ItemDto): number {
    return item.id;
  }
}
