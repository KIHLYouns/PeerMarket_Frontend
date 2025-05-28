import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ReviewDto {
  id: number;
  rating: number;
  comment: string;
  reviewerId: number;
  reviewerUsername: string;
  revieweeId: number;
  revieweeUsername: string;
  createdAt: string;
}

export interface CreateReviewRequestDto {
  rating: number;
  comment: string;
  revieweeId: number;
  reviewerId: number;
}

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private readonly apiUrl = `${environment.apiUrl}/reviews`;

  constructor(private http: HttpClient) {}

  createReview(reviewData: CreateReviewRequestDto): Observable<ReviewDto> {
    return this.http.post<ReviewDto>(this.apiUrl, reviewData);
  }

  getReviewById(reviewId: number): Observable<ReviewDto> {
    return this.http.get<ReviewDto>(`${this.apiUrl}/${reviewId}`);
  }

  getReviewsForUser(userId: number): Observable<ReviewDto[]> {
    return this.http.get<ReviewDto[]>(`${this.apiUrl}/user/${userId}`);
  }

  getReviewsByReviewer(reviewerId: number): Observable<ReviewDto[]> {
    return this.http.get<ReviewDto[]>(`${this.apiUrl}/by/${reviewerId}`);
  }
}
