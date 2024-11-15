import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/core/services/api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-recuperar',
  templateUrl: './recuperar.component.html',
  styleUrls: ['./recuperar.component.css']
})
export class RecuperarComponent implements OnInit {
  loading = false;
  resetPasswordForm: FormGroup;

  constructor(private fb: FormBuilder, private apiService: ApiService) {
    this.resetPasswordForm = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
    });
  }

  errorMessage: string | null = null;

  ngOnInit(): void {}

  onSubmit() {
    if (this.resetPasswordForm.invalid) {
      this.resetPasswordForm.markAllAsTouched();
      return;
    }

    const formData = {
      correoElectronico: this.resetPasswordForm.value.username,
    };

    this.apiService.post('Login/olvidemicontraseña', formData).subscribe({
      next: (response: any) => {
        Swal.fire('Éxito', 'Le hemos enviado un correo, para restablecer la contraseña siga las instrucciones.', 'success');
      },
      error: (error) => {
        this.loading = false;

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.error.mensaje,
          confirmButtonText: 'Aceptar'
        });
      }
    });
  }

  get username() {
    return this.resetPasswordForm.get('username');
  }
}
