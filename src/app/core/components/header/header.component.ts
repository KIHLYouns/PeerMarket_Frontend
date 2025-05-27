import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { combineLatest, map, Observable, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  public isAuthenticated$!: Observable<boolean>;
  public navState$!: Observable<{ isAuthenticated: boolean }>;
  isAuthenticated = false;
  
  private destroy$ = new Subject<void>();
  
  constructor(
    private authService: AuthService,
  ) {}
  
  ngOnInit(): void {
    this.isAuthenticated$ = this.authService.authState$;
    this.navState$ = this.isAuthenticated$.pipe(
      map(isAuthenticated => ({ isAuthenticated }))
    );
    
    this.isAuthenticated$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(authenticated => {
      this.isAuthenticated = authenticated;
    });
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  logout(): void {
    this.authService.logout();
  }
}