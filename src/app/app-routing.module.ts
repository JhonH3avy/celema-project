import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileAdminComponent } from './features/general/profile-admin/profile-admin.component';
import { RoleAdminComponent } from './features/general/role-admin/role-admin.component';
import { ProductAdminComponent } from './features/general/product-admin/product-admin.component';

const routes: Routes = [
  { path: 'administracion-perfiles', component: ProfileAdminComponent },
  { path: 'administracion-roles', component: RoleAdminComponent },
  { path: 'administracion-productos', component: ProductAdminComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
