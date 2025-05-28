import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppUserDto, UserProfileViewDto, UserService } from '../../../../core/services/user.service';

@Component({
  selector: 'app-profile-info-form',
  standalone: false,
  templateUrl: './profile-info-form.component.html',
  styleUrls: ['./profile-info-form.component.scss']
})
export class ProfileInfoFormComponent implements OnInit, OnChanges {
  @Input() userProfile!: UserProfileViewDto;
  @Input() isOwnProfile!: boolean;

  profileForm!: FormGroup;
  isLoading = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder, 
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.initForm();
    if (this.userProfile) {
      this.populateForm(this.userProfile);
    }
    if (!this.isOwnProfile) {
      this.profileForm.disable();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['userProfile'] && this.userProfile && this.profileForm) {
      this.populateForm(this.userProfile);
    }
    if (changes['isOwnProfile'] && this.profileForm) {
      if (!this.isOwnProfile) {
        this.profileForm.disable();
      } else {
        this.profileForm.enable();
      }
    }
  }

  private initForm(): void {
    this.profileForm = this.fb.group({
      username: [{ value: '', disabled: !this.isOwnProfile }, [Validators.required, Validators.minLength(3)]],
      email: [{ value: '', disabled: true }],
      bio: [{ value: '', disabled: !this.isOwnProfile }, [Validators.maxLength(500)]]
    });
  }

  private populateForm(profile: UserProfileViewDto): void {
    this.profileForm.patchValue({
      username: profile.username,
      email: profile.email,
      bio: profile.bio || ''
    });
  }

  onSubmit(): void {
    if (!this.isOwnProfile || this.profileForm.invalid) {
      this.markFormGroupTouched(this.profileForm);
      return;
    }

    this.isLoading = true;
    this.successMessage = null;
    this.errorMessage = null;

    const formValues = this.profileForm.getRawValue();
    const updatedUserData: Partial<AppUserDto> = {
      username: formValues.username,
      bio: formValues.bio
    };

    this.userService.updateUser(this.userProfile.id, updatedUserData).subscribe({
      next: (updatedUser) => {
        this.isLoading = false;
        this.successMessage = 'Profil mis à jour avec succès !';
        setTimeout(() => this.successMessage = null, 3000);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = "Erreur lors de la mise à jour du profil. Veuillez réessayer.";
        console.error('Error updating profile:', err);
        setTimeout(() => this.errorMessage = null, 5000);
      }
    });
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
