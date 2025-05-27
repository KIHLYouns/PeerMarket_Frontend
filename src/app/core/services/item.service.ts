import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export enum ItemCondition {
  NEW = 'NEW',
  USED_LIKE_NEW = 'USED_LIKE_NEW',
  USED_GOOD = 'USED_GOOD',
  USED_FAIR = 'USED_FAIR',
  USED_POOR = 'USED_POOR',
}

export enum ItemStatus {
  AVAILABLE = 'AVAILABLE',
  SOLD = 'SOLD',
  PENDING = 'PENDING',
  DRAFT = 'DRAFT',
  DELETED = 'DELETED',
}

export interface ImageDto {
  id: number;
  url: string;
  itemId?: number;
}

export interface ItemDto {
  id: number;
  title: string;
  description: string;
  price: number;
  condition: ItemCondition;
  status: ItemStatus;
  sellerId: number;
  sellerUsername: string;
  sellerAvatarUrl?: string;
  sellerAverageRating?: number;
  sellerRatingCount?: number;
  sellerCityId?: number;
  sellerCityName?: string;
  categoryId: number;
  categoryName: string;
  createdAt: string;
  viewCount?: number;
  images: ImageDto[];
}

export interface CreateItemDto {
  title: string;
  description?: string;
  price: number;
  condition: ItemCondition;
  sellerId: number;
  categoryId: number;
  images?: ImageDto[];
}

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  private readonly apiUrl = `${environment.apiUrl}/items`;

  constructor(private http: HttpClient) {}

  createItem(itemData: CreateItemDto): Observable<ItemDto> {
    return this.http.post<ItemDto>(this.apiUrl, itemData);
  }

  getItemById(id: number): Observable<ItemDto> {
    return this.http.get<ItemDto>(`${this.apiUrl}/${id}`);
  }

  getAllItems(params?: {
    sellerId?: number;
    categoryId?: number;
    title?: string;
  }): Observable<ItemDto[]> {
    let httpParams = new HttpParams();
    if (params?.sellerId) {
      httpParams = httpParams.set('sellerId', params.sellerId.toString());
    }
    if (params?.categoryId) {
      httpParams = httpParams.set('categoryId', params.categoryId.toString());
    }
    if (params?.title) {
      httpParams = httpParams.set('title', params.title);
    }
    return this.http.get<ItemDto[]>(this.apiUrl, { params: httpParams });
  }

  updateItem(id: number, itemData: Partial<ItemDto>): Observable<ItemDto> {
    return this.http.put<ItemDto>(`${this.apiUrl}/${id}`, itemData);
  }

  deleteItem(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  addSingleImageToItem(itemId: number, imageFile: File): Observable<ImageDto> {
    const formData = new FormData();
    formData.append('imageFile', imageFile);
    return this.http.post<ImageDto>(`${this.apiUrl}/${itemId}/images/single`, formData);
  }

  addMultipleImagesToItem(itemId: number, imageFiles: File[]): Observable<ItemDto> {
    const formData = new FormData();
    imageFiles.forEach(file => formData.append('imageFiles', file));
    return this.http.post<ItemDto>(`${this.apiUrl}/${itemId}/images`, formData);
  }

  deleteItemImage(itemId: number, imageId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${itemId}/images/${imageId}`);
  }

  getItemImages(itemId: number): Observable<ImageDto[]> {
    return this.http.get<ImageDto[]>(`${this.apiUrl}/${itemId}/images`);
  }

  getItemSuggestions(strategyName?: string): Observable<ItemDto[]> {
    let httpParams = new HttpParams();
    if (strategyName) {
      httpParams = httpParams.set('strategy', strategyName);
    }
    return this.http.get<ItemDto[]>(`${this.apiUrl}/suggestions`, { params: httpParams });
  }

  getItemsBySellerId(sellerId: number): Observable<ItemDto[]> {
    return this.getAllItems({ sellerId });
  }

  getItemsByCategoryId(categoryId: number): Observable<ItemDto[]> {
    return this.getAllItems({ categoryId });
  }

  searchItemsByTitle(title: string): Observable<ItemDto[]> {
    return this.getAllItems({ title });
  }
}
