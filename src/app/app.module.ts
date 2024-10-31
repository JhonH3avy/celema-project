import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from './features/auth/auth.module';
import { HomeComponent } from './features/general/home/home.component';
import { MenuComponent } from './shared/components/menu/menu.component';
import { ProfileAdminComponent } from './features/general/profile-admin/profile-admin.component';
import { RoleAdminComponent } from './features/general/role-admin/role-admin.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { ProductAdminComponent } from './features/general/product-admin/product-admin.component';
import { ProductFamilyAdminComponent } from './features/general/product-family-admin/product-family-admin.component';
import { EquipmentAdminComponent } from './features/general/equipment-admin/equipment-admin.component';
import { DemandPlanificationComponent } from './features/general/demand-planification/demand-planification.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MenuComponent,
    ProfileAdminComponent,
    RoleAdminComponent,
    FooterComponent,
    ProductAdminComponent,
    ProductFamilyAdminComponent,
    EquipmentAdminComponent,
    DemandPlanificationComponent,
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
