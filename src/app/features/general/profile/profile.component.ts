import { ConsultaDeUsuario } from './../../../core/services/model/consultaDeUsuario';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { UsuariosDto, UsuariosService } from 'src/app/core/services';
import { jwtDecode } from 'jwt-decode';
import { ActivatedRoute, Router } from '@angular/router';
import { matchValidator } from 'src/app/core/validators/match.validator';
import * as bootstrap from 'bootstrap';

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
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      const paramToken = params['token'];
      let paramEmail;
      let useParamToken = false;
      if (paramToken) {
        useParamToken = true;
        localStorage.removeItem('authToken');
        localStorage.setItem('tempToken', paramToken);
        let decodedParamToken: any;
        try {
          decodedParamToken = jwtDecode(paramToken);
        } catch (error) {
          console.error('Token invalido:', error);
          return;
        }
        paramEmail = decodedParamToken.email;
      }
      const token = useParamToken ? paramToken : localStorage.getItem('authToken');
      let decodedToken: any;
      if (!useParamToken) {
        try {
          decodedToken = jwtDecode(token);
        } catch (error) {
          console.error('Token invalido:', error);
          return;
        }
      }
      const userEmail = useParamToken ? paramEmail : decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/userdata'];
      const consultaUsuario = {
        correoElectronico: userEmail,
      } as ConsultaDeUsuario;
      this.usuariosService.apiUsuariosConsultarusuarioPost(consultaUsuario)
        .subscribe(
          response => this.handleGetUserResponse(response.datos),
          error => console.error(error)
        );
    });

    this.newPassword.valueChanges
      .subscribe(newPassword => {
        if (newPassword && !this.newPassword.hasValidator(Validators.minLength(6)) && !this.newPassword.hasValidator(Validators.pattern("[^a-zA-Z0-9]"))) {
          this.newPassword.addValidators([Validators.minLength(6), Validators.pattern("[^a-zA-Z0-9]")]);
          this.newPassword.updateValueAndValidity({emitEvent: false});
          this.profileControlGroup.addValidators(matchValidator('confirmPassword', 'newPassword'));
        } else if (!newPassword) {
          this.newPassword.clearValidators();
          this.profileControlGroup.removeValidators(matchValidator('confirmPassword', 'newPassword'));
        }
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
