import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { AddItemRoutingModule } from './add-item-routing.module';
import { AddItemFormComponent } from './components/add-item-form/add-item-form.component';

@NgModule({
  declarations: [
    AddItemFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AddItemRoutingModule
  ]
})
export class AddItemModule { }
