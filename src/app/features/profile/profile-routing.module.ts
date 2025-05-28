import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { AuthGuard } from '../../core/guards/auth.guard'; // Assurez-vous que ce guard existe

const routes: Routes = [
  {
    path: '', // Route pour le profil de l'utilisateur connecté
    component: ProfilePageComponent,
    canActivate: [AuthGuard] // Protéger la page de profil
  },
  {
    path: ':userId', // Route pour voir le profil d'un autre utilisateur
    component: ProfilePageComponent,
    // canActivate: [AuthGuard] // Optionnel: protéger aussi la vue des profils des autres
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }