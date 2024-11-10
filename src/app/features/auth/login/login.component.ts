import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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
    private apiService: ApiService
  ) {
    // Inicializamos el formulario con un nuevo campo rememberMe
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]],
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

    this.apiService.post('Login/loginusuario', formData).subscribe({
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
        this.errorMessage = 'Hubo un error al iniciar sesión. Intenta nuevamente.';

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Usuario y/o contraseña inválida.',
          confirmButtonText: 'Aceptar'
        });
      }
    });
  }

  infoUsuario(usuario: any, clave: any){
    const formData = {
      correoElectronico: usuario,
      clave: clave
    };
    this.apiService.postBearer('Usuarios/consultarusuario', formData).subscribe({
      next: (response: any) => {
        localStorage.removeItem('nombres');
        localStorage.removeItem('apellidos');
        localStorage.removeItem('cargo');

        localStorage.setItem('nombres', response.datos.nombre);
        localStorage.setItem('apellidos', response.datos.apellido);
        localStorage.setItem('cargo', response.datos.cargo);
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = 'Hubo un error. Intenta nuevamente.';

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al consultar el servicio.',
          confirmButtonText: 'Aceptar'
        });
      }
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
