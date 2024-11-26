import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuariosService } from 'src/app/core/services/api/usuarios.service';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';
import { UsuariosDto } from 'src/app/core/services';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { matchValidator } from 'src/app/core/validators/match.validator';

@Component({
  selector: 'app-reestablecer-password',
  standalone: false,
  templateUrl: './reestablecer-password.component.html',
  styleUrl: './reestablecer-password.component.css'
})
export class ReestablecerPasswordComponent implements OnInit {

  loginForm: FormGroup;

  currentUser: UsuariosDto | null = null;
  loading = false;

  get password(): AbstractControl {
    return this.loginForm.controls['password'];
  }

  get confirmPassword(): AbstractControl {
    return this.loginForm.controls['confirmPassword'];
  }

  constructor(
    private usuariosService: UsuariosService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
  ) {
    this.loginForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(4)]],
      confirmPassword: ['', [Validators.required]],
    }, {
      validators: [matchValidator('confirmPassword', 'password')]
    });
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      const paramToken = params['token'];
      let paramEmail: string = '';
      let decodedParamToken: any;
      if (paramToken) {
        localStorage.removeItem('authToken');
        localStorage.setItem('tempToken', paramToken);
        try {
          decodedParamToken = jwtDecode(paramToken);
        } catch (error) {
          Swal.fire({
            title: '¡Token inválido!',
            text: 'El token que ha usado es inválido o ha expirado',
            icon: 'error',
          }).then(() => {
            this.router.navigate(['/login']);
          });
          return;
        }
        paramEmail = decodedParamToken.email;
      }
      this.usuariosService.apiUsuariosConsultarusuarioGet(paramEmail)
        .subscribe(
          response => this.currentUser = response.datos ?? null,
          error => {
            if (error.status === 401) {
              Swal.fire({
                title: '¡No autorizado!',
                text: 'El token que ha usado es inválido o ha expirado.',
                icon: 'error',
              }).then(() => {
                this.router.navigate(['/login']);
              });
            } else if (error.status === 400) {
              Swal.fire({
                title: '¡Ha ocurrido un error!',
                text: error.error,
                icon: 'error',
              });
            }
          }
        );
    });
  }

  updatePassword(): void {
    const userUpdateRequest = {
      nombre: this.currentUser?.nombre,
      apellido: this.currentUser?.apellido,
      cargo: this.currentUser?.cargo,
      cedula: this.currentUser?.cedula,
      clave: this.password.value,
      id: this.currentUser?.id,
    } as UsuariosDto;
    this.loading = true;
    this.usuariosService.apiUsuariosActualizarUsuarioIdPut(this.currentUser!.id!, userUpdateRequest)
      .subscribe(response => {
        if (response.datos) {
          Swal.fire({
            title: '¡Actualización exitosa!',
            text: response.exito,
            icon: 'success',
          });
          this.router.navigate(['/login']);
        }
      }, error => {
        if (error.status === 400) {
          Swal.fire({
            title: '¡Ha ocurrido un error!',
            text: error.error,
            icon: 'error',
          });
        }
      }, () => {
        this.loading = false;
      });
  }

}
