import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CityDto } from './city.service';
import { ItemDto } from './item.service';
import { SavedItemDto } from './saved-item.service';
import { ReviewDto } from './review.service';


export interface AddressDto {
  id?: number;
  city?: CityDto;
  longitude: number;
  latitude: number;
}

export interface CreateAddressDto {
  longitude: number;
  latitude: number;
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  PENDING_VERIFICATION = 'PENDING_VERIFICATION',
  SUSPENDED = 'SUSPENDED',
  DEACTIVATED = 'DEACTIVATED',
}

export enum AppUserRole {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export interface AppUserDto {
  id: number;
  username: string;
  email: string;
  avatarUrl?: string;
  bio?: string;
  joinDate?: string;
  status?: UserStatus;
  role?: AppUserRole;
  verified?: boolean;
  address?: AddressDto;
  averageRating?: number;
  ratingCount?: number;
}

export interface CreateUserDto {
  username: string;
  email: string;
  password?: string;
  avatarUrl?: string;
  bio?: string;
  address?: CreateAddressDto;
}

export interface UserProfileViewDto {
  id: number;
  username: string;
  email: string;
  avatarUrl?: string;
  bio?: string;
  joinDate: string;
  address?: AddressDto;
  verified: boolean;
  itemsListed: ItemDto[];
  reviewsReceived: ReviewDto[];
  reviewsGiven: ReviewDto[];
  savedItems: SavedItemDto[];
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly usersApiUrl = `${environment.apiUrl}/users`;
  private readonly userProfileApiUrl = `${environment.apiUrl}/users/profile`;

  constructor(private http: HttpClient) {}

  createUser(userData: CreateUserDto): Observable<AppUserDto> {
    return this.http.post<AppUserDto>(this.usersApiUrl, userData);
  }

  getUserById(id: number): Observable<AppUserDto> {
    return this.http.get<AppUserDto>(`${this.usersApiUrl}/${id}`);
  }

  getUserByUsername(username: string): Observable<AppUserDto> {
    return this.http.get<AppUserDto>(`${this.usersApiUrl}/username/${username}`);
  }

  updateUser(id: number, userData: Partial<AppUserDto>): Observable<AppUserDto> {
    return this.http.put<AppUserDto>(`${this.usersApiUrl}/${id}`, userData);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.usersApiUrl}/${id}`);
  }

  getUserProfileView(userId: number): Observable<UserProfileViewDto> {
    return this.http.get<UserProfileViewDto>(`${this.userProfileApiUrl}/${userId}`);
  }
}
