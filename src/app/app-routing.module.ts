import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileAdminComponent } from './features/general/profile-admin/profile-admin.component';

const routes: Routes = [
  { path: 'administracion-perfiles', component: ProfileAdminComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
