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

const routes: Routes = [
  { path: 'administracion-perfiles', component: ProfileAdminComponent },
  { path: 'administracion-roles', component: RoleAdminComponent },
  { path: 'administracion-productos', component: ProductAdminComponent },
  { path: 'administracion-familia-productos', component: ProductFamilyAdminComponent },
  { path: 'administracion-equipos', component: EquipmentAdminComponent },
  { path: 'planificacion-demanda', component: DemandPlanificationComponent },
  { path: 'restriccion-equipos', component: EquipmentRestrictionComponent },
  { path: 'restriccion-lavados', component: WashRestrictionComponent },
  { path: 'planificacion-rutas', component: RoutePlanificationComponent },
  { path: 'planificacion-product', component: ProductionPlanificationComponent },
  { path: 'planificacion-rutas-detalle', component: RoutePlanificationDetailComponent },
  { path: 'planificacion-rutas-priorizacion', component: RoutePlanificationPriorizationComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
