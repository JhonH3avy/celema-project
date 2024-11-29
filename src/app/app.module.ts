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
import { EquipmentRestrictionComponent } from './features/general/equipment-restriction/equipment-restriction.component';
import { WashRestrictionComponent } from './features/general/wash-restriction/wash-restriction.component';
import { RoutePlanificationComponent } from './features/general/route-planification/route-planification.component';
import { ProfileComponent } from './features/general/profile/profile.component';
import { CoreModule } from './core/services/core.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApiModule as ApiModuleV2, Configuration as ConfigurationV2 } from './core/services-v2';
import { ApiModule, Configuration } from './core/services';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RoutePlanificationDetailComponent } from './features/general/route-planification-detail/route-planification-detail.component';
import { RoutePlanificationPriorizationComponent } from './features/general/route-planification-priorization/route-planification-priorization.component';
import { ProductionPlanificationComponent } from './features/general/production-planification/production-planification.component';
import { environment } from 'src/environments/environment';
import { DatePipe } from '@angular/common';

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
    EquipmentRestrictionComponent,
    WashRestrictionComponent,
    RoutePlanificationComponent,
    ProfileComponent,
    ProductionPlanificationComponent,
    RoutePlanificationDetailComponent,
    RoutePlanificationPriorizationComponent,
    WashRestrictionComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AuthModule,
    CoreModule,
    FormsModule,
    ReactiveFormsModule,
    ApiModule.forRoot(() => {
      return new Configuration({
        basePath: environment.apiUrl
      });
    }),
    ApiModuleV2.forRoot(() => {
      return new ConfigurationV2({
        basePath: environment.apiUrlV2
      });
    }),
    SweetAlert2Module.forRoot(),
    BrowserAnimationsModule,
    NgbModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    DatePipe,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
