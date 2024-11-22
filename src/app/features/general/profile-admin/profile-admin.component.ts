import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from 'src/app/core/services/api.service';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-profile-admin',
  templateUrl: './profile-admin.component.html',
  styleUrls: ['./profile-admin.component.css']
})
export class ProfileAdminComponent implements OnInit {

  data: any[] = [];
  dataRoles: any[] = [];
  filteredData: any[] = [];
  paginatedData: any[] = [];
  userCount = 0;
  searchQuery: string = '';
  selectedRoleId: number | null = null;

  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 0;
  pages: number[] = [];

  // para sección editar roles
  nombreUsuarioTitle = "";
  cargoTitle = "";
  Form: FormGroup;
  modalRef: any;
  imageBase64: string | null = null;
  imagePreview: string | null = null;

  constructor(private apiService: ApiService, private fb: FormBuilder, private modalService: NgbModal) {
    this.Form = this.fb.group({
      cedula: ['', [Validators.required]],
      nombres: ['', [Validators.required]],
      apellidos: ['', [Validators.required]],
      cargo: ['', [Validators.required]],
      correo: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit(): void {
    this.getData();
    this.getRoles();
  }

  onSubmit(): void {

    const formData = {
      cedula: this.Form.value.cedula,
      nombre: this.Form.value.nombres,
      apellido: this.Form.value.apellidos,
      cargo: this.Form.value.cargo,
      correoElectronico: this.Form.value.correo,
      clave: this.Form.value.cedula,
      activo: true,
      foto: this.imageBase64,
    };
    this.apiService.postBearer('api/Usuarios/crearusuario', formData).subscribe({
      next: (response) => {
        this.onResetForm();
        this.closeModal();
        this.getData();
        Swal.fire('Perfil creado', 'El usuario se ha creado exitosamente.', 'success');
      },
      error: (error) => {
        Swal.fire('Error', 'Hubo un error al crear el perfil.', 'error');
      }
      });
  }

  desactivarUsuario(id: any, activo:any){

    let mensaje = activo == false ?'Activar' : 'Desactivar';
    let mensajeAux = activo == false ?'activo' : 'desactivo';

    Swal.fire({
      title: '¿Estás seguro?',
      text: mensaje + ' el usuario',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, ' + mensaje,
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.apiService.patch('api/Usuarios/eliminarusuarios/' + id).subscribe({
          next: (response) => {
            this.getData();
            Swal.fire(
              activo == false ? 'Activado' : 'Desactivado!',
              'El usuario se '+ mensajeAux +' con exito.',
              'success'
            );
          },
          error: (error) => {
            Swal.fire('Error', 'Hubo un error al desactivar el perfil.', 'error');
          }
          });
      }
    });
  }

  getProfileAccessStyle(access: string): string[] {
    switch (access) {
      case 'Admin': return ['border-primary', 'text-primary', 'bg-primary-subtle'];
      case 'Editor de plan': return ['border-danger', 'text-danger', 'bg-danger-subtle'];
      case 'Lector': return ['border-success', 'text-success', 'bg-success-subtle'];
      default: return [];
    }
  }

  closeModal(): void {
    const closeButton = document.querySelector('[data-bs-dismiss="modal"]') as HTMLButtonElement;
    if (closeButton) {
      closeButton.click();  // 'click' ahora está disponible
    }
  }

  onResetForm() {
    this.Form.reset();
  }


  clearData(){
    this.currentPage = 1;
    this.getData();
    this.searchQuery = '';
  }

  getData() {
    this.apiService.get('api/Usuarios/listausuarios').subscribe({
      next: (response: any) => {
        this.data = response.datos;
        this.filteredData = this.data;
        this.userCount = this.filteredData.length;
        this.totalPages = Math.ceil(this.userCount / this.itemsPerPage);
        this.updatePagination();
        this.updatePaginatedData();
        console.log("Esta es la respuesta", response);
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al consultar el servicio.',
          confirmButtonText: 'Aceptar'
        });
      }
    });
  }

  filterData(): void {
    if (this.searchQuery.trim() === '') {
      this.filteredData = this.data;
    } else {
      this.filteredData = this.data.filter(profile =>
        profile.correoElectronico.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        profile.nombre.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        profile.apellido.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
      this.currentPage = 1;
    }
    this.userCount = this.filteredData.length;
    this.totalPages = Math.ceil(this.userCount / this.itemsPerPage);
    this.updatePagination();
    this.updatePaginatedData();
  }

  changePage(pageToLoad: number): void {
    if (pageToLoad < 1 || pageToLoad > this.totalPages) return;
    this.currentPage = pageToLoad;
    this.updatePaginatedData();
  }

  updatePaginatedData(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedData = this.filteredData.slice(startIndex, endIndex); // Usa filteredData en lugar de data
  }

  changeItemsPerPage(): void {
    this.totalPages = Math.ceil(this.userCount / this.itemsPerPage);
    this.currentPage = 1;
    this.updatePaginatedData();
    this.updatePagination();
  }

  updatePagination(): void {
    this.pages = [];
    for (let i = 1; i <= this.totalPages; i++) {
      this.pages.push(i);
    }
  }

  exportToExcel(): void {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.paginatedData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Perfiles');

    XLSX.writeFile(wb, 'perfiles.xlsx');
  }

  previewImage(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        const base64Data = reader.result as string;

        this.imageBase64 = base64Data.split(',')[1];

        this.imagePreview = base64Data;
      };

      reader.readAsDataURL(file);
    }
  }

  get cedula() {
    return this.Form.get('cedula');
  }

  get nombres() {
    return this.Form.get('nombres');
  }

  get apellidos() {
    return this.Form.get('apellidos');
  }

  get cargo() {
    return this.Form.get('cargo');
  }

  get correo() {
    return this.Form.get('correo');
  }

  exportUser(user: any): void {
    const userData = [
      {
        'Nombre': user.nombre,
        'Apellido': user.apellido,
        'Correo Electrónico': user.correoElectronico,
        'Fecha de Ingreso': user.fechaIngreso,
        'Último Acceso': user.ultimoAcceso
      }
    ];

    console.log("Datos",userData);

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(userData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Perfil de Usuario');

    XLSX.writeFile(wb, `${user.nombre}_${user.apellido}_perfil.xlsx`)

  }

  openDropdown(element: HTMLElement): void {
    const dropdown = new bootstrap.Dropdown(element);
    dropdown.toggle();
  }

  datosUsuario(nombre:any, cargo:any){
    this.nombreUsuarioTitle = nombre;
    this.cargoTitle = cargo;
    this.selectedRole(1);
  }

  getRoles(){
    this.apiService.get('api/Roles/listarolesactivos').subscribe({
      next: (response: any) => {
        this.dataRoles = response.datos;
        console.log("Roles...", this.dataRoles);

        if (
          this.selectedRoleId &&
          !this.dataRoles.some((role) => role.id === this.selectedRoleId)
        ) {
          this.selectedRoleId = null; // Si no existe, deselecciona
        }

      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al consultar el servicio.',
          confirmButtonText: 'Aceptar'
        });
      }
    });
  }

  selectedRole(idRole:any){
    this.selectedRoleId = idRole;
  }

  onRoleSelect(roleId: number, event: any) {
    if (event.target.checked) {
      this.selectedRoleId = roleId;
    } else {
      this.selectedRoleId = null;
    }

    this.dataRoles.forEach((role) => {
      if (role.id !== roleId) {
        (document.querySelector(`input[value="${role.id}"]`) as HTMLInputElement).checked = false;
      }
    });
  }

  applyChanges() {
    if (this.selectedRoleId) {
      console.log('Rol seleccionado:', this.selectedRoleId);
      this.apiService.put('api/Usuarios/crearusuario', null).subscribe({
        next: (response) => {
          this.onResetForm();
          this.closeModal();
          this.getData();
          Swal.fire('Permiso actualizado', 'El permiso se ha actualizado exitosamente.', 'success');
        },
        error: (error) => {
          Swal.fire('Error', 'Hubo un error al crear el perfil.', 'error');
        }
        });
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Atención',
        text: 'Debe seleccionar un rol antes de aplicar los cambios.',
        confirmButtonText: 'Aceptar',
      });
    }
  }
}

