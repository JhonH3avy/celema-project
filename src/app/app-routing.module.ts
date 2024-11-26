import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileAdminComponent } from './features/general/profile-admin/profile-admin.component';
import { RoleAdminComponent } from './features/general/role-admin/role-admin.component';
import { ProductAdminComponent } from './features/general/product-admin/product-admin.component';
import { ProductFamilyAdminComponent } from './features/general/product-family-admin/product-family-admin.component';
import { EquipmentAdminComponent } from './features/general/equipment-admin/equipment-admin.component';
import { DemandPlanificationComponent } from './features/general/demand-planification/demand-planification.component';
import { EquipmentRestrictionComponent } from './features/general/equipment-restriction/equipment-restriction.component';
import { WashRestrictionComponent } from './features/general/wash-restriction/wash-restriction.component';
import { RoutePlanificationComponent } from './features/general/route-planification/route-planification.component';
import { ProductionPlanificationComponent } from './features/general/production-planification/production-planification.component';
import { RoutePlanificationDetailComponent } from './features/general/route-planification-detail/route-planification-detail.component';
import { RoutePlanificationPriorizationComponent } from './features/general/route-planification-priorization/route-planification-priorization.component';
import { authGuard } from './core/guards/auth.guard';

const routes: Routes = [
  { path: 'administracion-perfiles', component: ProfileAdminComponent, canActivate: [authGuard] },
  { path: 'administracion-roles', component: RoleAdminComponent, canActivate: [authGuard] },
  { path: 'administracion-productos', component: ProductAdminComponent, canActivate: [authGuard] },
  { path: 'administracion-familia-productos', component: ProductFamilyAdminComponent, canActivate: [authGuard] },
  { path: 'administracion-equipos', component: EquipmentAdminComponent, canActivate: [authGuard] },
  { path: 'planificacion-demanda', component: DemandPlanificationComponent, canActivate: [authGuard] },
  { path: 'restriccion-equipos', component: EquipmentRestrictionComponent, canActivate: [authGuard] },
  { path: 'restriccion-lavados', component: WashRestrictionComponent, canActivate: [authGuard] },
  { path: 'planificacion-rutas', component: RoutePlanificationComponent, canActivate: [authGuard] },
  { path: 'planificacion-product', component: ProductionPlanificationComponent, canActivate: [authGuard] },
  { path: 'planificacion-rutas-detalle', component: RoutePlanificationDetailComponent, canActivate: [authGuard] },
  { path: 'planificacion-rutas-priorizacion', component: RoutePlanificationPriorizationComponent, canActivate: [authGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
