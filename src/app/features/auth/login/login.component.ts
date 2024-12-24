import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuariosService } from 'src/app/core/services';
import { ApiService } from 'src/app/core/services/api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  loading = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private apiService: ApiService,
    private usuariosService: UsuariosService,
  ) {
    // Inicializamos el formulario con un nuevo campo rememberMe
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(3)]],
      rememberMe: [false]  // Campo para recordar la contraseña
    });
  }

  ngOnInit(): void {
    // Al iniciar el componente, verificamos si hay datos en localStorage para recordar la contraseña
    const rememberMe = localStorage.getItem('rememberMe');
    if (rememberMe === 'true') {
      this.loginForm.patchValue({
        rememberMe: true
      });

      const savedUsername = localStorage.getItem('username');
      if (savedUsername) {
        this.loginForm.patchValue({
          username: savedUsername
        });
      }

      const savedPassword = localStorage.getItem('password');
      if (savedPassword) {
        this.loginForm.patchValue({
          password: savedPassword
        });
      }
    }
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = null;

    const formData = {
      correoElectronico: this.loginForm.value.username,
      clave: this.loginForm.value.password
    };

    this.apiService.post('api/Login/loginusuario', formData).subscribe({
      next: (response: any) => {
        const token = response.token;
        localStorage.setItem('authToken', token);

        this.infoUsuario(this.loginForm.value.username, this.loginForm.value.password);

        // Guardamos el estado de "Recordar mi contraseña" y el usuario si está marcado
        if (this.loginForm.value.rememberMe) {
          localStorage.setItem('rememberMe', 'true');
          localStorage.setItem('username', this.loginForm.value.username);
          localStorage.setItem('password', this.loginForm.value.password);
        } else {
          localStorage.removeItem('rememberMe');
          localStorage.removeItem('username');
          localStorage.removeItem('password');
        }

        this.loading = false;
        this.router.navigate(['/home']);
      },
      error: (error) => {
        this.loading = false;
        console.log(error);

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.error.mensaje,
          confirmButtonText: 'Aceptar'
        }).then((result) => {
          if (result.isConfirmed) {
            if(error.status == 423){
              this.router.navigate(['/recuperar']);
            }
          }
        });
      }
    });
  }

  infoUsuario(usuario: any, _: any){
    this.usuariosService.apiUsuariosConsultarusuarioGet(usuario)
      .subscribe(response => {
        localStorage.removeItem('idUsuario');
        localStorage.removeItem('nombres');
        localStorage.removeItem('apellidos');
        localStorage.removeItem('cargo');

        localStorage.setItem('idUsuario', response.datos?.id!.toString()!);
        localStorage.setItem('nombres', response.datos?.nombre!);
        localStorage.setItem('apellidos', response.datos?.apellido!);
        localStorage.setItem('cargo', response.datos?.cargo!);
        if (response.datos?.foto) {
          localStorage.setItem('foto-perfil', response.datos?.foto);
        }
      }, error => {
        this.loading = false;
        this.errorMessage = 'Hubo un error. Intenta nuevamente.';

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al consultar el servicio.',
          confirmButtonText: 'Aceptar'
        });
      });
  }

  navigateToRecover() {
    this.router.navigate(['/recuperar']);
  }

  get username() {
    return this.loginForm.get('username');
  }

  get password() {
    return this.loginForm.get('password');
  }

}
