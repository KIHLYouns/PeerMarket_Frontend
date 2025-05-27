import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule, // Ajouté pour les services HTTP
    CoreModule, // importing this makes HeaderComponent available for use
    AppRoutingModule, // this configures the router service with root routes
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
