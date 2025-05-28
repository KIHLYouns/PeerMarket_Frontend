import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  address: {
    longitude: number;
    latitude: number;
  };
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  userId: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/auth`;

  private authState = new BehaviorSubject<boolean>(this.hasToken());
  public authState$ = this.authState.asObservable();

  private currentUserSubject = new BehaviorSubject<AuthResponse | null>(this.getUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  private hasToken(): boolean {
    return !!localStorage.getItem('authToken');
  }

  private getUserFromStorage(): AuthResponse | null {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response) => {
        localStorage.setItem('authToken', response.accessToken);
        localStorage.setItem('currentUser', JSON.stringify(response));
        this.authState.next(true);
        this.currentUserSubject.next(response);
      })
    );
  }

  signUp(signUpData: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/signup`, signUpData).pipe(
      tap((response) => {
        localStorage.setItem('authToken', response.accessToken);
        localStorage.setItem('currentUser', JSON.stringify(response));
        this.authState.next(true);
        this.currentUserSubject.next(response);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    this.authState.next(false);
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/sign-in']);
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  getCurrentUser(): AuthResponse | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return this.authState.value;
  }
}
