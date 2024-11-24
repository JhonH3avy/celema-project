import { Component, OnInit } from '@angular/core';
import { ActualizarRoleDto, ModulosRolesPermisosService, RoleDto, RolesService, TblPermiso } from 'src/app/core/services';
import * as bootstrap from 'bootstrap';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import { TblModulos } from 'src/app/core/services/model/tblModulos';

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

  moduleList: TblModulos[] = [];
  permissionList: TblPermiso[] = [];

  currentRoleId = 0;
  currentRoleModulePermissions: {id: number, idModule: number, idPermission: number}[] = [];

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
  ) {
    this.roleFormGroup = this.fb.group({
      nombre: ['', Validators.required],
      estado: [false, Validators.required],
    });
    this.config.size = 'lg';
  }

  ngOnInit(): void {
    this.modulosRolesPermisosService.apiModulosRolesPermisosObtenermodulosypermisosGet()
      .subscribe(response => {
        this.moduleList = response.modulos ?? [];
        this.permissionList = response.permisos ?? [];
      });
    this.getData();
    this.searchQuery.valueChanges.subscribe(query => this.filterData(query));

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
        error => console.error(error)
      );
  }

  filterData(query: string): void {
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
    const updateRole = {
      id: this.currentRoleId,
      nombre: this.nombre.value,
      estado: this.estado.value,
    } as ActualizarRoleDto;
    if (updateRole.id === 0) {
      this.rolesService.apiRolesCrearrolePost(updateRole)
        .subscribe(
          response => {
            const createdRole = response.datos ?? {};
            this.roles = [createdRole, ...this.roles];
            this.filterData('');
            this.modalService.dismissAll();
            Swal.fire(
              `¡Creación exitosa!`,
              `El usuario se creó con éxito.`,
              'success'
            );
            this.rolesCount = this.filteredData.length;
            this.totalPages = Math.ceil(this.rolesCount / this.itemsPerPage);
            this.updatePagination();
            this.updatePaginatedData();
          }
        )
    } else {
      this.rolesService.apiRolesActualizarrolePut(updateRole)
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
            this.filterData('');
            this.modalService.dismissAll();
            Swal.fire(
              `¡Actualización exitosa!`,
              `El usuario se actualizó con éxito.`,
              'success'
            );
            this.rolesCount = this.filteredData.length;
            this.totalPages = Math.ceil(this.rolesCount / this.itemsPerPage);
            this.updatePagination();
            this.updatePaginatedData();
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
          this.filterData('');
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
  }

  updatePagination(): void {
    this.pages = [];
    for (let i = 1; i <= this.totalPages; i++) {
      this.pages.push(i);
    }
  }

  exportToExcel(): void {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.roles);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Roles');
    XLSX.writeFile(wb, 'roles.xlsx');
  }

  updatePermission(idModule: number, idPermission: number, event: any): void {
    const checked = event.target.checked as boolean;
    const modulePermission = this.currentRoleModulePermissions.find(x => x.idModule === idModule && x.idPermission === idPermission);
    if (checked) {
      if (!modulePermission) {
        this.currentRoleModulePermissions.push({id: 0, idModule, idPermission});
      }
    } else {
      if (modulePermission) {
        this.currentRoleModulePermissions = this.currentRoleModulePermissions.filter(x => x.idModule === idModule && x.idPermission === idPermission);
      }
    }
  }

}
