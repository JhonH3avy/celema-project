import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { UsuariosDto, UsuariosService } from 'src/app/core/services';
import { jwtDecode } from 'jwt-decode';
import { ActivatedRoute, Router } from '@angular/router';
import { matchValidator } from 'src/app/core/validators/match.validator';
import * as bootstrap from 'bootstrap';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  profileControlGroup = this.fb.group({
    username: ['', Validators.required],
    newPassword: [''],
    confirmPassword: [''],
    name: ['', Validators.required],
    lastname: ['', Validators.required],
    cargo: ['', Validators.required],
    cedula: ['', Validators.required],
    profile: [''],
  });

  fullName = '';
  cargo = '';

  private currentUserId: number | undefined;

  errorOnUpdate = '';

  get usuarioDto(): UsuariosDto {
    return {
      nombre: this.profileControlGroup.get('name')?.value,
      apellido: this.profileControlGroup.get('lastname')?.value,
      cargo: this.profileControlGroup.get('cargo')?.value,
      cedula: Number.parseInt(this.profileControlGroup.get('cedula')?.value ?? ''),
      clave: this.profileControlGroup.get('newPassword')?.value === '' ? null : this.profileControlGroup.get('newPassword')?.value,
      id: this.currentUserId,
    } as UsuariosDto;
  }

  get newPassword(): FormControl {
    return this.profileControlGroup.controls['newPassword'];
  }

  get confirmPassword(): FormControl {
    return this.profileControlGroup.controls['confirmPassword'];
  }

  constructor(
    private usuariosService: UsuariosService,
    private fb: FormBuilder,
    private router: Router,
  ) { }

  ngOnInit(): void {
    const token = localStorage.getItem('authToken') ?? '';
    let decodedToken: any;
    try {
      decodedToken = jwtDecode(token);
    } catch (error) {
      Swal.fire({
        title: '¡Token inválido!',
        text: 'El token que ha usado es inválido',
        icon: 'error',
      }).then(() => {
        this.router.navigate(['/login']);
      });
      return;
    }
    const userEmail = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/userdata'];
    this.usuariosService.apiUsuariosConsultarusuarioGet(userEmail)
      .subscribe(
        response => this.handleGetUserResponse(response.datos),
        error => {
          if (error.status === 400) {
            Swal.fire({
              title: '¡Ha ocurrido un error!',
              text: error.error,
              icon: 'error',
            });
          }
        }
      );

      this.profileControlGroup = this.fb.group({
        username: ['', Validators.required],
        newPassword: ['', Validators.minLength(4)],
        confirmPassword: [''],
        name: ['', Validators.required],
        lastname: ['', Validators.required],
        cargo: ['', Validators.required],
        cedula: ['', Validators.required],
        profile: [''],
      });

      this.profileControlGroup.setValidators(matchValidator('newPassword', 'confirmPassword'));

      this.newPassword.valueChanges
      .subscribe(() => {
        this.newPassword.updateValueAndValidity();
      });

  }

  async goBackToHome(): Promise<void> {
    const success = await this.router.navigate(['home']);
    if (!success) {
      console.error('Was not possible to novigate to "Home"');
    }
  }

  saveChanges(successModalElement: HTMLElement, failureModalElement: HTMLElement): void {
    const successModal = new bootstrap.Modal(successModalElement);
    const failureModal = new bootstrap.Modal(failureModalElement);
    this.usuariosService.apiUsuariosActualizarUsuarioIdPut(this.currentUserId!, this.usuarioDto)
      .subscribe(
        response => {
          if (response.datos) {
            successModal.show();
          } else {
            this.errorOnUpdate = 'Hubo un error al guardar los cambios';
            failureModal.show();
          }
        },
        error => {
          console.error(error);
          this.errorOnUpdate = error;
          failureModal.show();
        }
      );
  }

  private handleGetUserResponse(user: any): void {
    this.fullName = `${user.nombre} ${user.apellido}`;
    this.cargo = user.cargo;
    this.currentUserId = user.id;
    this.profileControlGroup.get('username')?.setValue(user.correoElectronico);
    this.profileControlGroup.get('name')?.setValue(user.nombre);
    this.profileControlGroup.get('lastname')?.setValue(user.apellido);
    this.profileControlGroup.get('cargo')?.setValue(user.cargo);
    this.profileControlGroup.get('cedula')?.setValue(user.cedula);
  }
}
