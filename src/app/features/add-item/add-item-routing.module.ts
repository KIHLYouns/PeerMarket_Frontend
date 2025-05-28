import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../core/guards/auth.guard';
import { AddItemFormComponent } from './components/add-item-form/add-item-form.component';

const routes: Routes = [
  {
    path: 'new',
    component: AddItemFormComponent,
    data: { mode: 'create' },
    canActivate: [AuthGuard]
  },
  {
    path: 'edit/:id',
    component: AddItemFormComponent,
    data: { mode: 'edit' },
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddItemRoutingModule { }
