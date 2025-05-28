import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, switchMap, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AppUserDto, UserService } from './user.service';

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

  private currentUserSubject = new BehaviorSubject<AppUserDto | null>(this.getUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router, private userService: UserService) {}

  private hasToken(): boolean {
    return !!localStorage.getItem('authToken');
  }

  private getUserFromStorage(): AppUserDto | null {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response) => {
        localStorage.setItem('authToken', response.accessToken);
        this.authState.next(true);
      }),
      switchMap((response) => 
        this.userService.getUserById(response.userId).pipe(
          tap((userData) => {
            localStorage.setItem('currentUser', JSON.stringify(userData));
            this.currentUserSubject.next(userData);
          }),
          // Retourner la réponse originale de login si nécessaire pour la chaîne d'observables
          switchMap(() => [response]) 
        )
      )
    );
  }

  signUp(signUpData: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, signUpData).pipe(
      tap((response) => {
        localStorage.setItem('authToken', response.accessToken);
        this.authState.next(true);
      }),
      switchMap((response) => 
        this.userService.getUserById(response.userId).pipe(
          tap((userData) => {
            localStorage.setItem('currentUser', JSON.stringify(userData));
            this.currentUserSubject.next(userData);
          }),
          switchMap(() => [response])
        )
      )
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

  getCurrentUser(): AppUserDto | null {
    return this.currentUserSubject.value;
  }

  getUserData(): AppUserDto | null {
    const userData = localStorage.getItem('currentUser');
    return userData ? JSON.parse(userData) : null;
  }

  isAuthenticated(): boolean {
    return this.authState.value;
  }
}
