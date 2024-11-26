import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RecuperarComponent } from './recuperar/recuperar.component';
import { HomeComponent } from '../general/home/home.component';
import { MenuComponent } from 'src/app/shared/components/menu/menu.component';
import { ProfileComponent } from '../general/profile/profile.component';
import { ProfileAdminComponent } from '../general/profile-admin/profile-admin.component';
import { authGuard } from 'src/app/core/guards/auth.guard';
import { tempAuthGuard } from 'src/app/core/guards/temp-auth.guard';
import { ReestablecerPasswordComponent } from './reestablecer-password/reestablecer-password.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'recuperar', component: RecuperarComponent },
  { path: 'home', component: HomeComponent, canActivate: [authGuard] },
  { path: 'menu', component: MenuComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
  { path: 'profile-admin', component: ProfileAdminComponent, canActivate: [authGuard] },
  { path: 'reestablecer-contrasena', component: ReestablecerPasswordComponent, canActivate: [tempAuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
