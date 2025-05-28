import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { ItemsModule } from '../items/items.module'; // Import pour utiliser ItemCardComponent
import { ProfileRoutingModule } from './profile-routing.module';

// Pages
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';

// Components
import { ProfileHeaderComponent } from './components/profile-header/profile-header.component';
import { ProfileInfoFormComponent } from './components/profile-info-form/profile-info-form.component';
import { ProfileTabsComponent } from './components/profile-tabs/profile-tabs.component';
import { UserItemsListComponent } from './components/user-items-list/user-items-list.component';
import { UserReviewsListComponent } from './components/user-reviews-list/user-reviews-list.component';
import { UserSavedItemsComponent } from './components/user-saved-items/user-saved-items.component';

@NgModule({
  declarations: [
    ProfilePageComponent,
    ProfileHeaderComponent,
    ProfileTabsComponent,
    ProfileInfoFormComponent,
    UserItemsListComponent,
    UserReviewsListComponent,
    UserSavedItemsComponent
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    ReactiveFormsModule,
    ItemsModule // Pour utiliser ItemCardComponent
  ],
  providers: [
    DatePipe
  ]
})
export class ProfileModule { }
