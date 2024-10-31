import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileAdminComponent } from './features/general/profile-admin/profile-admin.component';
import { RoleAdminComponent } from './features/general/role-admin/role-admin.component';
import { ProductAdminComponent } from './features/general/product-admin/product-admin.component';
import { ProductFamilyAdminComponent } from './features/general/product-family-admin/product-family-admin.component';
import { EquipmentAdminComponent } from './features/general/equipment-admin/equipment-admin.component';
import { DemandPlanificationComponent } from './features/general/demand-planification/demand-planification.component';
import { EquipmentRestrictionComponent } from './features/general/equipment-restriction/equipment-restriction.component';

const routes: Routes = [
  { path: 'administracion-perfiles', component: ProfileAdminComponent },
  { path: 'administracion-roles', component: RoleAdminComponent },
  { path: 'administracion-productos', component: ProductAdminComponent },
  { path: 'administracion-familia-productos', component: ProductFamilyAdminComponent },
  { path: 'administracion-equipos', component: EquipmentAdminComponent },
  { path: 'planificacion-demanda', component: DemandPlanificationComponent },
  { path: 'restriccion-equipos', component: EquipmentRestrictionComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
