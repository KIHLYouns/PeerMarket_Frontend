import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'items', pathMatch: 'full' },
  { 
    path: 'items', 
    loadChildren: () => import('./features/items/items.module').then(m => m.ItemsModule) 
  },
  { 
    path: 'auth', 
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule) 
  },
  { 
    path: 'profile', 
    loadChildren: () => import('./features/profile/profile.module').then(m => m.ProfileModule),
    canActivate: [AuthGuard]
  },
  { 
    path: 'messages', 
    loadChildren: () => import('./features/messages/messages.module').then(m => m.MessagesModule),
    canActivate: [AuthGuard]
  },
  { 
    path: 'item', 
    loadChildren: () => import('./features/add-item/add-item.module').then(m => m.AddItemModule),
    canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }