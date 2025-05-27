import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ItemDto } from './item.service';

export interface SavedItemDto {
  id: number;
  userId: number;
  itemId: number;
  savedAt: string;
  item?: ItemDto;
}

export interface CreateSavedItemDto {
  userId: number;
  itemId: number;
}

@Injectable({
  providedIn: 'root'
})
export class SavedItemService {
  private readonly baseApiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  saveItem(createDto: CreateSavedItemDto): Observable<SavedItemDto> {
    return this.http.post<SavedItemDto>(`${this.baseApiUrl}/saved-items`, createDto);
  }

  unsaveItem(userId: number, itemId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseApiUrl}/users/${userId}/saved-items/${itemId}`);
  }

  getSavedItemsByUser(userId: number): Observable<SavedItemDto[]> {
    return this.http.get<SavedItemDto[]>(`${this.baseApiUrl}/users/${userId}/saved-items`);
  }

  isItemSavedByUser(userId: number, itemId: number): Observable<{ isSaved: boolean }> {
    return this.http.get<{ isSaved: boolean }>(`${this.baseApiUrl}/users/${userId}/saved-items/${itemId}/exists`);
  }
}
