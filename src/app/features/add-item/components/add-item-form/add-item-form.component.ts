import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { finalize, switchMap, takeUntil } from 'rxjs/operators';
import { AuthService } from '../../../../core/services/auth.service';
import { CategoryDto, CategoryService } from '../../../../core/services/category.service';
import {
    CreateItemDto,
    ImageDto,
    ItemCondition,
    ItemDto,
    ItemService
} from '../../../../core/services/item.service';

@Component({
  selector: 'app-add-item-form',
  standalone: false,
  templateUrl: './add-item-form.component.html',
  styleUrls: ['./add-item-form.component.scss']
})
export class AddItemFormComponent implements OnInit, OnDestroy {
  itemForm!: FormGroup;
  isEditMode = false;
  currentItemId: number | null = null;
  isLoading = false;
  errorMessage: string | null = null;
  
  imagePreviews: string[] = [];
  filesToUpload: File[] = [];
  existingImages: ImageDto[] = [];
  
  readonly itemConditions = [
    { key: 'Neuf', value: ItemCondition.NEW },
    { key: 'Comme neuf', value: ItemCondition.USED_LIKE_NEW },
    { key: 'Bon état', value: ItemCondition.USED_GOOD },
    { key: 'État correct', value: ItemCondition.USED_FAIR },
    { key: 'Mauvais état', value: ItemCondition.USED_POOR }
  ];
  
  categories: CategoryDto[] = [];
  currentSellerId: number | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private itemService: ItemService,
    private authService: AuthService,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadCurrentUser();
    this.loadCategories();

    this.route.data.pipe(takeUntil(this.destroy$)).subscribe(data => {
      this.isEditMode = data['mode'] === 'edit';
      if (this.isEditMode) {
        this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
          this.currentItemId = +params['id'];
          if (this.currentItemId) {
            this.loadItemData(this.currentItemId);
          } else {
            this.errorMessage = "ID d'article manquant pour l'édition.";
          }
        });
      }
    });
  }

  private initForm(): void {
    this.itemForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(2000)]],
      price: [null, [Validators.required, Validators.min(0.01)]],
      condition: [ItemCondition.USED_GOOD, Validators.required],
      categoryId: [null, Validators.required]
    });
  }

  private loadCurrentUser(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.currentSellerId = currentUser.id;
    } else {
      this.errorMessage = 'Utilisateur non connecté';
      this.router.navigate(['/auth/sign-in']);
    }
  }

  private loadCategories(): void {
    this.categoryService.getAllCategories().pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors du chargement des catégories.';
        console.error('Error loading categories:', err);
      }
    });
  }

  private loadItemData(id: number): void {
    this.isLoading = true;
    this.itemService.getItemById(id).pipe(
      takeUntil(this.destroy$),
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (item) => {
        // Vérifier que l'utilisateur actuel est le propriétaire de l'item
        if (item.sellerId !== this.currentSellerId) {
          this.errorMessage = 'Vous n\'êtes pas autorisé à modifier cette annonce.';
          this.router.navigate(['/items', id]);
          return;
        }

        this.itemForm.patchValue({
          title: item.title,
          description: item.description,
          price: item.price,
          condition: item.condition,
          categoryId: item.categoryId
        });
        this.existingImages = item.images || [];
      },
      error: (err) => {
        this.errorMessage = `Erreur lors du chargement de l'article: ${err.message || 'Erreur inconnue'}`;
        console.error('Error loading item:', err);
      }
    });
  }

  onFileSelected(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      const files = Array.from(inputElement.files);
      
      for (const file of files) {
        if (this.filesToUpload.length + this.existingImages.length >= 5) {
          this.errorMessage = 'Vous ne pouvez télécharger que 5 images au maximum.';
          break; 
        }
        if (file.size > 5 * 1024 * 1024) { // 5MB
          this.errorMessage = `Le fichier ${file.name} est trop volumineux (max 5MB).`;
          continue;
        }
        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
          this.errorMessage = `Format de fichier non supporté pour ${file.name}.`;
          continue;
        }

        this.filesToUpload.push(file);
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.imagePreviews.push(e.target.result);
        };
        reader.readAsDataURL(file);
      }
      inputElement.value = '';
    }
  }

  removeNewImage(index: number): void {
    this.filesToUpload.splice(index, 1);
    this.imagePreviews.splice(index, 1);
    if (this.filesToUpload.length === 0) {
      this.errorMessage = null;
    }
  }

  onSubmit(): void {
    this.errorMessage = null;
    if (this.itemForm.invalid) {
      this.itemForm.markAllAsTouched();
      this.errorMessage = "Veuillez corriger les erreurs dans le formulaire.";
      return;
    }

    if (!this.currentSellerId) {
      this.errorMessage = "Impossible de créer l'annonce : utilisateur non connecté.";
      return;
    }

    this.isLoading = true;
    const itemDataFromForm = this.itemForm.value;

    if (this.isEditMode && this.currentItemId) {
      const updateDto: Partial<ItemDto> = { ...itemDataFromForm };
      this.itemService.updateItem(this.currentItemId, updateDto).pipe(
        switchMap((updatedItem: ItemDto) => {
          if (this.filesToUpload.length > 0 && updatedItem.id) {
            return this.itemService.addMultipleImagesToItem(updatedItem.id, this.filesToUpload);
          }
          return [updatedItem];
        }),
        takeUntil(this.destroy$),
        finalize(() => this.isLoading = false)
      ).subscribe({
        next: (result) => {
          this.router.navigate(['/items', this.currentItemId]);
        },
        error: (err) => {
          this.errorMessage = `Erreur lors de la mise à jour: ${err.message || 'Erreur inconnue'}`;
          console.error('Error updating item:', err);
        }
      });
    } else {
      const createDto: CreateItemDto = {
        ...itemDataFromForm,
        sellerId: this.currentSellerId
      };
      this.itemService.createItem(createDto).pipe(
        switchMap((createdItem: ItemDto) => {
          if (this.filesToUpload.length > 0 && createdItem.id) {
            return this.itemService.addMultipleImagesToItem(createdItem.id, this.filesToUpload);
          }
          return [createdItem];
        }),
        takeUntil(this.destroy$),
        finalize(() => this.isLoading = false)
      ).subscribe({
        next: (result) => {
          const newItemId = (result as ItemDto).id || (result as any).id;
          if (newItemId) {
            this.router.navigate(['/items', newItemId]);
          } else {
            this.router.navigate(['/items']);
          }
        },
        error: (err) => {
          this.errorMessage = `Erreur lors de la création: ${err.message || 'Erreur inconnue'}`;
          console.error('Error creating item:', err);
        }
      });
    }
  }

  goBack(): void {
    if (this.isEditMode && this.currentItemId) {
      this.router.navigate(['/items', this.currentItemId]);
    } else {
      this.router.navigate(['/items']);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Helpers pour l'accès aux contrôles de formulaire dans le template
  get title() { return this.itemForm.get('title'); }
  get description() { return this.itemForm.get('description'); }
  get price() { return this.itemForm.get('price'); }
  get condition() { return this.itemForm.get('condition'); }
  get categoryId() { return this.itemForm.get('categoryId'); }
}
