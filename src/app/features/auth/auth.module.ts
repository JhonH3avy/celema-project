import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import { RecuperarComponent } from './recuperar/recuperar.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { ReestablecerPasswordComponent } from './reestablecer-password/reestablecer-password.component';


@NgModule({
  declarations: [
    LoginComponent,
    RecuperarComponent,
    ReestablecerPasswordComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule,
    SweetAlert2Module
  ],

  exports:[LoginComponent, RecuperarComponent]
})
export class AuthModule { }
