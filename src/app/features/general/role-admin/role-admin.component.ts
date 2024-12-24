import { Component, OnInit } from '@angular/core';
import { ActualizarRoleDto, CrearRoleDto, DateOnly, ModulosRolesPermisosService, RoleDto, RolesService, TblPermiso } from 'src/app/core/services';
import * as bootstrap from 'bootstrap';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import { TblModulos } from 'src/app/core/services/model/tblModulos';
import { DatePipe } from '@angular/common';

interface ModulePermission {
  idModulo: number;
  idPermisos: number[]
}

export interface TblModulosAux {
    id?: number;
    nombreModulo?: string | null;
    fechaCreacion?: string;
    isCheck?: boolean;
    permisos?: Array<TblModulosAux2> | null;
}

export interface TblModulosAux2 {
  idModulo?: number;
  nombre?: string | null;
  tblRolesPermisos?: Array<number> | null;
  isChecked: boolean
}

@Component({
  selector: 'app-role-admin',
  templateUrl: './role-admin.component.html',
  styleUrls: ['./role-admin.component.css']
})


export class RoleAdminComponent implements OnInit {

  currentPage = 1;
  totalPages = 5;
  pages: number[] = [];

  roles: RoleDto[] = [];

  roleFormGroup: FormGroup;
  itemsPerPage = 10;
  rolesCount = 0;

  filteredData: RoleDto[] = [];
  paginatedData: RoleDto[] = [];

  searchQuery = new FormControl();

  moduleList: TblModulosAux[] = [];
  permissionList: TblPermiso[] = [];

  moduleListEdit: TblModulos[] = [];

  currentRoleId = 0;

  currentRoleModulePermissions: ModulePermission[] = [];

  get nombre(): FormControl {
    return this.roleFormGroup.controls['nombre'] as FormControl;
  }

  get estado(): FormControl {
    return this.roleFormGroup.controls['estado'] as FormControl;
  }

  constructor(
    private rolesService: RolesService,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private config: NgbModalConfig,
    private modulosRolesPermisosService: ModulosRolesPermisosService,
    private datePipe: DatePipe,
  ) {
    this.roleFormGroup = this.fb.group({
      nombre: ['', Validators.required],
      estado: [false, Validators.required],
    });
    this.config.size = 'lg';
  }

  checkedRegister: {checked: boolean, id: number}[] = [];
  model: RoleDto[] = [];

  ngOnInit(): void {
    this.getData();
  }

  cargarModulosCrear(){
    this.moduleList = [];
    this.permissionList = [];
    this.modulosRolesPermisosService.apiModulosRolesPermisosObtenermodulosypermisosGet()
    .subscribe(response => {

      this.moduleList = response.modulos ?? [];
      this.permissionList = response.permisos ?? [];
    });
  }

  cargarModulosEdicion(modulos: any){
    this.moduleListEdit = modulos;
    this.modulosRolesPermisosService.apiModulosRolesPermisosObtenermodulosypermisosGet()
    .subscribe(response => {

      this.moduleList = response.modulos ?? [];
      this.permissionList = response.permisos ?? [];

      this.moduleListEdit.forEach(element => {
        this.moduleList.forEach(elementModule => {
          if(element.idModulo == elementModule.id){
            elementModule.isCheck = true;
            elementModule.permisos = element.idPermisos;
            console.log("Permisos", elementModule.permisos);
            console.log("Permisos...", element.idPermisos);
            element.idPermisos!.forEach(elementPermission => {
              this.updatePermissionCarga(element.idModulo!, Number(elementPermission), true);
            });
          }
        });
      });
    });
  }

  isPermissionInList(module: any, id: any): boolean {
    let retorno = false;

    // Verificamos si module es válido (no es null ni undefined)
    if (module && Array.isArray(module) && module.length > 0) {
      // Iterar sobre los elementos del array
      module.forEach((element: { id: any; }) => {
        // Si encontramos un elemento con el mismo id, lo marcamos como true
        if (element == id) {
          retorno = true;
        }
      });
    }

    return retorno;
  }

  getData(): void {
    this.rolesService.apiRolesListarolesGet()
      .subscribe(
        response => {
          this.currentPage = 1;
          this.roles = response.datos ?? [];
          this.filteredData = this.roles;
          this.rolesCount = this.filteredData.length;
          this.totalPages = Math.ceil(this.rolesCount / this.itemsPerPage);
          this.updatePagination();
          this.updatePaginatedData();
        },
        error => {
          Swal.fire({
            title: 'Error',
            text: error.error,
            icon: 'error'
          });
        }
      );
  }

  filterData(): void {
    const query = this.searchQuery.value;
    if (query.trim() === '') {
      this.filteredData = this.roles;
    } else {
      this.filteredData = this.roles.filter(role =>
        role.nombre?.toLowerCase().includes(query.toLowerCase())
      );
      this.currentPage = 1;
    }
    this.rolesCount = this.filteredData.length;
    this.totalPages = Math.ceil(this.rolesCount / this.itemsPerPage);
    this.updatePagination();
    this.updatePaginatedData();
  }

  getStatusStyle(status: boolean): string[] {
    switch (status) {
      case true: return ['border-success', 'text-success', 'bg-success-subtle'];
      case false: return ['border-danger', ' text-danger', 'bg-danger-subtle'];
      default: return [];
    }
  }

  changePage(pageToLoad: number): void {
    this.currentPage = pageToLoad;
    this.updatePaginatedData();
  }

  openModal(element: HTMLElement): void {
    const modal = new bootstrap.Modal(element);
    modal.show();
  }

  closeModal(modal: any): void {
    modal.dismiss();
  }

  toggleDropdown(element: HTMLElement): void {
    const dropdown = new bootstrap.Dropdown(element);
    dropdown.toggle();
    dropdown.dispose();
  }

  openUpdateRoleModal(id: number, modalContent: any): void {
    const role = this.roles.find(x => x.id === id);
    this.currentRoleId = id;
    this.nombre.setValue(role?.nombre);
    this.estado.setValue(role?.estado);
    this.modalService.open(modalContent, { ariaLabelledBy: 'modalTitle' });
  }

  openCreateRoleModal(modalContent: any): void {
    this.currentRoleId = 0;
    this.currentRoleModulePermissions = [];
    this.nombre.setValue('');
    this.estado.setValue(false);
    this.modalService.open(modalContent, { ariaLabelledBy: 'modalTitle' });
  }

  saveRoleChanges(): void {
    const create = {
      nombre: this.nombre.value,
      estado: this.estado.value,
      usuarioId: Number(localStorage.getItem('idUsuario')),
      modulos: this.currentRoleModulePermissions
    } as CrearRoleDto;

    const update = {
      id: this.currentRoleId,
      nombre: this.nombre.value,
      estado: this.estado.value,
      modulos: this.currentRoleModulePermissions
    };
    if (this.currentRoleId === 0) {
      this.rolesService.apiRolesCrearrolePost(create)
        .subscribe(
          response => {
            const createdRole = response.datos ?? {};
            this.roles = [createdRole, ...this.roles];
            this.searchQuery.setValue('');
            this.filterData();
            this.modalService.dismissAll();
            Swal.fire(
              `¡Creación exitosa!`,
              `El rol se creó con éxito.`,
              'success'
            );
            this.rolesCount = this.filteredData.length;
            this.totalPages = Math.ceil(this.rolesCount / this.itemsPerPage);
            this.updatePagination();
            this.updatePaginatedData();
            this.getData();
          }
        )
    } else {
      this.rolesService.apiRolesActualizarrolePut(update)
        .subscribe(
          _ => {
            const roleToUpdate = this.roles.find(x => x.id === this.currentRoleId);
            const updatedRole = {
              id: roleToUpdate?.id,
              nombre: this.nombre.value,
              estado: this.estado.value,
              fechaCreacion: roleToUpdate?.fechaCreacion,
            } as RoleDto;
            this.roles = [updatedRole, ...this.roles.filter(x => x.id !== this.currentRoleId)];
            this.searchQuery.setValue('');
            this.filterData();
            this.modalService.dismissAll();
            Swal.fire(
              `¡Actualización exitosa!`,
              `El rol se actualizó con éxito.`,
              'success'
            );
            this.rolesCount = this.filteredData.length;
            this.totalPages = Math.ceil(this.rolesCount / this.itemsPerPage);
            this.updatePagination();
            this.updatePaginatedData();
            this.getData();
          },
          error => {
            console.error(error);
          }
        );
    }
  }

  toggleRoleStatus(id: number, status: boolean): void {
    const role = this.roles.find(x => x.id === id);
    const updateRole = {
      id: role?.id,
      nombre: role?.nombre,
      estado: status,
    } as ActualizarRoleDto;
    this.rolesService.apiRolesActualizarrolePut(updateRole)
      .subscribe(
        _ => {
          const roleUpdated = this.roles.find(x => x.id === role!.id);
          roleUpdated!.estado = status;
          this.filterData();
          const newStatus = status ? 'Activado' : 'Desactivado';
          Swal.fire(
            `${newStatus}!`,
            `El usuario fue ${newStatus.toLocaleLowerCase()} con éxito.`,
            'success'
          );
        },
        error => {
          console.error(error);
        }
      );
  }

  changeItemsPerPage(): void {
    this.totalPages = Math.ceil(this.rolesCount / this.itemsPerPage);
    this.currentPage = 1;
    this.updatePaginatedData();
    this.updatePagination();
  }

  updatePaginatedData(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedData = this.filteredData.slice(startIndex, endIndex); // Usa filteredData en lugar de data
    this.checkedRegister = this.paginatedData.map(p => {
      return {
        checked: false,
        id: p.id!,
      };
    });
  }

  updatePagination(): void {
    this.pages = [];
    for (let i = 1; i <= this.totalPages; i++) {
      this.pages.push(i);
    }
  }

  exportToExcel(): void {
      let target: RoleDto[] = [];
      console.log("checkedRegister...",this.checkedRegister);
      if (this.checkedRegister.filter(x => x.checked).length > 0) {
        target = this.model.filter(x => this.checkedRegister.filter(x => x.checked).some(c => x.id === c.id));
        console.log("target1...",target);
      } else {
        target = this.model;
        console.log("target...2",target);
      }
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(target);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Roles');
      XLSX.writeFile(wb, 'roles.xlsx');
    }

  updatePermissionCarga(idModule: number, idPermission: number, event: boolean): void {

    // Buscar si ya existe el módulo en la lista
    let modulePermission = this.currentRoleModulePermissions.find(x => x.idModulo === idModule);

    if (event) {
      // Si no existe el módulo, agregarlo con el permiso
      if (!modulePermission) {
        this.currentRoleModulePermissions.push({
          idModulo: idModule,
          idPermisos: [idPermission] // Agregar directamente el permiso
        });
      } else {
        // Si el módulo existe, agregar el permiso si no está ya en la lista
        if (!modulePermission.idPermisos.includes(idPermission)) {
          modulePermission.idPermisos.push(idPermission); // Agregar al array
        }
      }
    } else {
      if (modulePermission) {
        // Si el permiso está marcado como no seleccionado, eliminarlo del array
        modulePermission.idPermisos = modulePermission.idPermisos.filter(
          permission => permission !== idPermission
        );

        // Si no quedan permisos, eliminar el módulo completo
        if (modulePermission.idPermisos.length === 0) {
          this.currentRoleModulePermissions = this.currentRoleModulePermissions.filter(
            x => x.idModulo !== idModule
          );
        }
      }
    }

    console.log("Estos son los módulos con permisos cargados:", this.currentRoleModulePermissions);
  }

  updatePermission(idModule: number, idPermission: number, event: any): void {
    const checked = event.target.checked as boolean;

    // Buscar si ya existe el módulo en la lista
    let modulePermission = this.currentRoleModulePermissions.find(x => x.idModulo === idModule);

    if (checked) {
      // Si no existe el módulo, agregarlo con el permiso
      if (!modulePermission) {
        this.currentRoleModulePermissions.push({
          idModulo: idModule,
          idPermisos: [idPermission] // Agregar directamente el permiso
        });
      } else {
        // Si el módulo existe, agregar el permiso si no está ya en la lista
        if (!modulePermission.idPermisos.includes(idPermission)) {
          modulePermission.idPermisos.push(idPermission); // Agregar al array
        }
      }
    } else {
      if (modulePermission) {
        // Si el permiso está marcado como no seleccionado, eliminarlo del array
        modulePermission.idPermisos = modulePermission.idPermisos.filter(
          permission => permission !== idPermission
        );

        // Si no quedan permisos, eliminar el módulo completo
        if (modulePermission.idPermisos.length === 0) {
          this.currentRoleModulePermissions = this.currentRoleModulePermissions.filter(
            x => x.idModulo !== idModule
          );
        }
      }
    }

    console.log("Estos son los módulos con permisos:", this.currentRoleModulePermissions);
  }


  getDateFormatted(dateOnly: DateOnly | string): string {
    let target: string;
    if (typeof dateOnly === 'object') {
      target = dateOnly.toString();
    } else {
      target = dateOnly;
    }
    return this.datePipe.transform(target, 'dd/MM/yyyy') ?? '';
  }

  toggleAll(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.checkedRegister.forEach((item) => (item.checked = checked));
  }

  updateSelectAll(event: Event, id: number): void {
    const checked = (event.target as HTMLInputElement).checked;
    const productCheck = this.checkedRegister.find(x => x.id === id);
    if (productCheck) {
      productCheck.checked = checked;
    }
  }

  isAllChecked(): boolean {
    return this.checkedRegister.every((item) => item.checked);
  }

  isChecked(id: number) {
    return this.checkedRegister.find(x => x.id === id)?.checked;
  }

}
