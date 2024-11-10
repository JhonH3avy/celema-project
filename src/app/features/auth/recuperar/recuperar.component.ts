import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-recuperar',
  templateUrl: './recuperar.component.html',
  styleUrls: ['./recuperar.component.css']
})
export class RecuperarComponent implements OnInit {
  loading = false;
  resetPasswordForm: FormGroup;

  constructor(private fb: FormBuilder) {
    // Inicializa el formulario con validación
    this.resetPasswordForm = this.fb.group({
      username: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    if (this.resetPasswordForm.invalid) {
      // Marca todos los campos como tocados si el formulario es inválido
      this.resetPasswordForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    // Simula una llamada a la API
    setTimeout(() => {
      this.loading = false;
      Swal.fire('Éxito', 'Se ha enviado el enlace para restablecer la contraseña.', 'success');
    }, 5000);
  }

  get username() {
    return this.resetPasswordForm.get('username');
  }
}
