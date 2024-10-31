import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from './features/auth/auth.module';
import { HomeComponent } from './features/general/home/home.component';
import { MenuComponent } from './shared/components/menu/menu.component';
import { ProfileAdminComponent } from './features/general/profile-admin/profile-admin.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { ProfileComponent } from './features/general/profile/profile.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MenuComponent,
    ProfileAdminComponent,
    FooterComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AuthModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
