import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  // Initialisation avec la valeur correcte dès le départ
  showHeader = !window.location.pathname.startsWith('/admin');
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    this.restoreStateIfTokenStillValid();
  }
  
  private restoreStateIfTokenStillValid(): void {
    // Check if token is valid
    const isAuthenticated = this.authService.isAuthenticated();
    console.log('AppComponent: Auth state after restoration:', isAuthenticated);
    
    if (isAuthenticated) {
      console.log('Valid token found, user is authenticated');
      
      // Redirect if on auth pages
      if (this.router.url.includes('/auth')) {
        this.router.navigate(['/items']);
      }
    } else {
      console.log('No valid token found or token expired');

      if (!this.router.url.includes('/auth') && !this.router.url.includes('/items')) {
        this.router.navigate(['/items']);
      }
    }
  }
}