import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CategoryFilterComponent } from './components/category-filter/category-filter.component';
import { ItemCardComponent } from './components/item-card/item-card.component';
import { ItemListComponent } from './components/item-list/item-list.component';
import { ItemsRoutingModule } from './items-routing.module';

@NgModule({
  declarations: [
    ItemListComponent,
    ItemCardComponent,
    CategoryFilterComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ItemsRoutingModule
  ]
})
export class ItemsModule { }
