import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  catchError,
  Observable,
  of,
  Subject,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import { AuthService } from '../../../../core/services/auth.service';
import {
  AppUserDto,
  UserProfileViewDto,
  UserService,
} from '../../../../core/services/user.service';

@Component({
  selector: 'app-profile-page',
  standalone: false,
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss'],
})
export class ProfilePageComponent implements OnInit, OnDestroy {
  userProfile$: Observable<UserProfileViewDto | null>;
  isLoading = true;
  error: string | null = null;
  isOwnProfile = false;

  activeTab: string = 'info';
  availableTabs: { id: string; label: string }[] = [];

  private destroy$ = new Subject<void>();
  private loggedInUser: AppUserDto | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private authService: AuthService
  ) {
    this.userProfile$ = new Observable<UserProfileViewDto | null>();
  }

  ngOnInit(): void {
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => {
        this.loggedInUser = user;
      });

    this.userProfile$ = this.route.params.pipe(
      takeUntil(this.destroy$),
      switchMap((params) => {
        this.isLoading = true;
        this.error = null;
        let targetUserId: number | undefined;

        if (params['userId']) {
          targetUserId = +params['userId'];
        } else if (this.loggedInUser) {
          targetUserId = this.loggedInUser.id;
        } else {
          this.router.navigate(['/auth/sign-in']);
          return of(null);
        }

        if (targetUserId === undefined) {
          this.error = "Impossible de déterminer l'utilisateur à afficher.";
          this.isLoading = false;
          return of(null);
        }

        this.isOwnProfile = !!(
          this.loggedInUser && this.loggedInUser.id === targetUserId
        );
        this.setupTabs();

        return this.userService.getUserProfileView(targetUserId).pipe(
          catchError((err) => {
            console.error('Error fetching user profile:', err);
            this.error = "Profil non trouvé ou une erreur s'est produite.";
            if (err.status === 404) {
              this.error = "L'utilisateur demandé n'existe pas.";
            }
            return of(null);
          })
        );
      }),
      tap(() => (this.isLoading = false))
    );
  }

  setupTabs(): void {
    this.availableTabs = [];
    if (this.isOwnProfile) {
      this.availableTabs.push({ id: 'info', label: 'Informations' });
    }
    this.availableTabs.push(
      { id: 'items', label: 'Annonces' },
      { id: 'reviewsReceived', label: 'Avis Reçus' }
    );
    if (this.isOwnProfile) {
      this.availableTabs.push({ id: 'reviewsGiven', label: 'Avis Donnés' });
      this.availableTabs.push({
        id: 'savedItems',
        label: 'Articles Sauvegardés',
      });
    } 
    if (!this.isOwnProfile) {
      this.activeTab = 'items';
    }
  }

  onTabChanged(tabId: string): void {
    this.activeTab = tabId;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
