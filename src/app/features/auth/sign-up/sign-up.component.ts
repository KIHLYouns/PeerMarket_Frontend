import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { AuthService, RegisterRequest } from '../../../core/services/auth.service';
import { UserService } from '../../../core/services/user.service';
import { confirmEqualValidator } from '../../../shared/validators/confirm-equal.validator';

export interface UserCoordinates {
  latitude: number;
  longitude: number;
}

@Component({
  selector: 'app-sign-up',
  standalone: false,
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
})
export class SignUpComponent implements OnInit {
  mainForm!: FormGroup;

  usernameCtrl!: FormControl;
  emailCtrl!: FormControl;
  passwordCtrl!: FormControl;
  confirmPasswordCtrl!: FormControl;
  termsGeneralCtrl!: FormControl;

  showPassword = false;
  errorMessage = '';

  userCoordinates: UserCoordinates | null = null;
  locationStatus: 'pending' | 'granted' | 'denied' | 'error' = 'pending';

  showConfirmPasswordError$!: Observable<boolean>;

  private loadingStateSubject = new BehaviorSubject<boolean>(false);
  loadingState$ = this.loadingStateSubject.asObservable();

  constructor(
    private fb: FormBuilder, 
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initFormControls();
    this.initMainForm();
    this.initObservables();

    if ('geolocation' in navigator) {
      this.locationStatus = 'pending';
      setTimeout(() => {
        this.requestLocationPermission();
      }, 1000);
    } else {
      this.locationStatus = 'error';
    }
  }

  private initFormControls(): void {

    this.usernameCtrl = this.fb.control('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(20),
      Validators.pattern('^[a-zA-Z0-9_-]*$'),
    ]);

    this.emailCtrl = this.fb.control('', [
      Validators.required,
      Validators.email,
    ]);

    this.passwordCtrl = this.fb.control('', [
      Validators.required,
      Validators.minLength(8),
    ]);

    this.confirmPasswordCtrl = this.fb.control('', [Validators.required]);

    this.termsGeneralCtrl = this.fb.control(false, [Validators.requiredTrue]);
  }

  private initMainForm(): void {
    this.mainForm = this.fb.group(
      {
        username: this.usernameCtrl,
        email: this.emailCtrl,
        password: this.passwordCtrl,
        confirmPassword: this.confirmPasswordCtrl,
        termsGeneral: this.termsGeneralCtrl,
      },
      {
        validators: [confirmEqualValidator('password', 'confirmPassword')],
      }
    );
  }

  private initObservables(): void {
    this.showConfirmPasswordError$ = this.mainForm.statusChanges.pipe(
      map(
        (status) =>
          status === 'INVALID' &&
          this.passwordCtrl.value &&
          this.confirmPasswordCtrl.value &&
          this.mainForm.hasError('confirmEqual')
      )
    );
  }

  public togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  public requestLocationPermission(): void {
    if (this.locationStatus === 'granted') {
      return;
    }

    if ('geolocation' in navigator) {
      this.locationStatus = 'pending';

      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.userCoordinates = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          this.locationStatus = 'granted';
        },
        () => {
          this.locationStatus = 'denied';
        },
        {
          enableHighAccuracy: true,
          timeout: 20000,
          maximumAge: 0,
        }
      );
    }
  }

  public onSignUp(): void {
    if (this.mainForm.valid) {
      if (this.locationStatus !== 'granted' || !this.userCoordinates) {
        this.errorMessage = 'L\'autorisation de localisation est requise';
        this.requestLocationPermission();
        return;
      }

      this.loadingStateSubject.next(true);
      this.errorMessage = '';

      const signUpRequest: RegisterRequest = {
        username: this.usernameCtrl.value,
        email: this.emailCtrl.value,
        address: {
          longitude: this.userCoordinates.longitude,
          latitude: this.userCoordinates.latitude,
        },
        password: this.passwordCtrl.value,
      };

      this.userService.registerUser(signUpRequest).subscribe({
        next: () => {
          this.loadingStateSubject.next(false);
          this.router.navigate(['/']);
        },
        error: (error) => {
          this.loadingStateSubject.next(false);
          this.errorMessage = error.message || 'Échec de l\'inscription. Veuillez réessayer.';
        },
      });
    } else {
      this.markFormGroupTouched(this.mainForm);
    }
  }

  public getErrorMessage(control: AbstractControl): string {
    if (control.hasError('required')) {
      return 'Ce champ est obligatoire';
    }
    if (control.hasError('email')) {
      return 'Veuillez saisir une adresse email valide';
    }
    if (control.hasError('minlength')) {
      return `La longueur minimale est de ${control.errors?.['minlength']?.requiredLength} caractères`;
    }
    if (control.hasError('maxlength')) {
      return `La longueur maximale est de ${control.errors?.['maxlength']?.requiredLength} caractères`;
    }
    if (control.hasError('pattern')) {
      if (control === this.usernameCtrl) {
        return 'Le nom d\'utilisateur ne peut contenir que des lettres, des chiffres, des tirets bas et des tirets';
      }
    }
    if (control.hasError('requiredTrue')) {
      return 'Vous devez accepter les conditions générales';
    }
    return '';
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control) => {
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else {
        control.markAsTouched();
      }
    });
  }
}
