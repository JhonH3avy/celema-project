import { Component, OnInit } from '@angular/core';
import { ActualizarRoleDto, RolesService, TblRoles } from 'src/app/core/services';
import * as bootstrap from 'bootstrap';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-role-admin',
  templateUrl: './role-admin.component.html',
  styleUrls: ['./role-admin.component.css']
})
export class RoleAdminComponent implements OnInit {

  currentPage = 1;
  totalPages = 5;
  pages: number[] = [];

  roles: TblRoles[] = [];

  roleFormGroup: FormGroup;
  currentRoleId = 0;
  itemsPerPage = 10;
  rolesCount = 0;

  filteredData: TblRoles[] = [];
  paginatedData: TblRoles[] = [];

  searchQuery = new FormControl();

  permissionByModules = [
    {
      id: 1,
      module: 'Consultas',
    },
    {
      id: 2,
      module: 'Plan de producción',
    },
    {
      id: 3,
      module: 'Administración de usuarios',
    },
  ];

  get nombre(): FormControl {
    return this.roleFormGroup.controls['nombre'] as FormControl;
  }

  get estado(): FormControl {
    return this.roleFormGroup.controls['estado'] as FormControl;
  }

  constructor(
    private rolesService: RolesService,
    private fb: FormBuilder,
    private modalService: NgbModal
  ) {
    this.roleFormGroup = this.fb.group({
      nombre: ['', Validators.required],
      estado: [false, Validators.required],
    });
  }

  ngOnInit(): void {
    this.rolesService.apiRolesListarolesGet()
      .subscribe(
        response => {
          this.roles = response.datos;
          this.filteredData = this.roles;
          this.rolesCount = this.filteredData.length;
          this.totalPages = Math.ceil(this.rolesCount / this.itemsPerPage);
          this.updatePagination();
          this.updatePaginatedData();
        },
        error => console.error(error)
      );
    this.searchQuery.valueChanges.subscribe(query => this.filterData(query));

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
    this.nombre.setValue('');
    this.estado.setValue(false);
    this.modalService.open(modalContent, { ariaLabelledBy: 'modalTitle' });
  }

  saveRoleChanges(successModalContent: any): void {
    const updateRole = {
      id: this.currentRoleId,
      nombre: this.nombre.value,
      estado: this.estado.value,
    } as ActualizarRoleDto;
    if (updateRole.id === 0) {
      this.rolesService.apiRolesCrearrolePost(updateRole)
        .subscribe(
          response => {
            const createdRole = response.datos;
            this.roles = [createdRole, ...this.roles];
            this.filterData('');
            this.modalService.dismissAll();
            this.modalService.open(successModalContent);
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
            this.roles = [updateRole, ...this.roles.filter(x => x.id !== this.currentRoleId)];
            this.filterData('');
            this.modalService.dismissAll();
            this.modalService.open(successModalContent);
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

  toggleRoleStatus(id: number, status: boolean, modalContent: any): void {
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
          this.modalService.open(modalContent);
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
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.paginatedData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Roles');

    XLSX.writeFile(wb, 'roles.xlsx');
  }

}
