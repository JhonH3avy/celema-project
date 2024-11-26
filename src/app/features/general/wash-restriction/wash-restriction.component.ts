import { Component, OnInit } from '@angular/core';
import { ActualizarRestriccionLavadoDto, FamiliaProductoDto, FamiliaProductosService, MaquinasService, RestriccionDeLavadoService, RestriccionLavadoDto, TblPermiso} from 'src/app/core/services';
import * as bootstrap from 'bootstrap';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import { TblModulos } from 'src/app/core/services/model/tblModulos';
import { TblMaquinas } from 'src/app/core/services/model/tblMaquinas';
import { TblFamiliaProductos } from 'src/app/core/services/model/tblFamiliaProductos';

@Component({
  selector: 'app-wash-restriction',
  templateUrl: './wash-restriction.component.html',
  styleUrls: ['./wash-restriction.component.css']
})
export class WashRestrictionComponent implements OnInit {

  currentPage = 1;
  totalPages = 5;
  pages: number[] = [];

  model: RestriccionLavadoDto[] = [];

  formGroup: FormGroup;
  itemsPerPage = 10;
  count = 0;

  filteredData: RestriccionLavadoDto[] = [];
  paginatedData: RestriccionLavadoDto[] = [];

  searchQuery = new FormControl();

  moduleList: TblModulos[] = [];
  permissionList: TblPermiso[] = [];

  currentId = 0;

  lstEquipos : TblMaquinas[] = [];
  lstFamilia : TblFamiliaProductos[] = [];

  get codigo(): FormControl {
    return this.formGroup.controls['codigo'] as FormControl;
  }

  get descripcion(): FormControl {
    return this.formGroup.controls['descripcion'] as FormControl;
  }

  get familia(): FormControl {
    return this.formGroup.controls['familia'] as FormControl;
  }

  get tipo(): FormControl {
    return this.formGroup.controls['tipo'] as FormControl;
  }

  get frecuencia(): FormControl {
    return this.formGroup.controls['frecuencia'] as FormControl;
  }

  get tiempo(): FormControl {
    return this.formGroup.controls['tiempo'] as FormControl;
  }

  get equipo(): FormControl {
    return this.formGroup.controls['equipo'] as FormControl;
  }

  get estado(): FormControl {
    return this.formGroup.controls['estado'] as FormControl;
  }

  constructor(
    private service: RestriccionDeLavadoService,
    private maquinaService: MaquinasService,
    private familiaService: FamiliaProductosService,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private config: NgbModalConfig,
  ) {
    this.formGroup = this.fb.group({
      codigo: ['', Validators.required],
      descripcion: ['', Validators.required],
      familia: ['', Validators.required],
      tipo: ['', Validators.required],
      frecuencia: ['', Validators.required],
      tiempo: ['', Validators.required],
      equipo: ['', Validators.required],
      estado: [false, Validators.required],
    });
    config.size = 'lg';
  }

  ngOnInit(): void {
    this.maquinaService.apiMaquinasConsultamaquinasGet()
    .subscribe(response => {
      this.lstEquipos = response.datos ?? [];
    });

    this.familiaService.apiFamiliaProductosConsultarfamiliaGet()
    .subscribe(response => {
     // this.lstFamilia = response.datos ?? [];
    });

    this.getData();
    this.searchQuery.valueChanges.subscribe(query => this.filterData(query));

  }

  getData(): void {
    this.service.apiRestriccionDeLavadoListarestriccionlavadoGet()
      .subscribe(
        response => {
          this.currentPage = 1;
          this.model = response.datos ?? [];
          this.filteredData = this.model;
          this.count = this.filteredData.length;
          this.totalPages = Math.ceil(this.count / this.itemsPerPage);
          this.updatePagination();
          this.updatePaginatedData();
        },
        error => console.error(error)
      );
  }

  filterData(query: string): void {
    if (query.trim() === '') {
      this.filteredData = this.model;
    } else {
      this.filteredData = this.model.filter(role =>
        role.descripción?.toLowerCase().includes(query.toLowerCase())
      );
      this.currentPage = 1;
    }
    this.count = this.filteredData.length;
    this.totalPages = Math.ceil(this.count / this.itemsPerPage);
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

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
      this.updatePaginatedData();
    }
  }

  calculatePages() {
    const maxVisiblePages = 10;
    const startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);

    const adjustedStartPage = Math.max(1, endPage - maxVisiblePages + 1);

    this.pages = Array.from({ length: endPage - adjustedStartPage + 1 }, (_, i) => adjustedStartPage + i);
  }

  openModal(modalContent: any): void {
    this.currentId = 0;
    this.descripcion.setValue('');
    this.estado.setValue(false);
    this.modalService.open(modalContent, { ariaLabelledBy: 'modalTitle' });
  }

  closeModal(modal: any): void {
    modal.dismiss();
  }

  toggleDropdown(element: HTMLElement): void {
    const dropdown = new bootstrap.Dropdown(element);
    dropdown.toggle();
    dropdown.dispose();
  }

  openUpdateModal(id: number, modalContent: any): void {
    const model = this.model.find(x => x.id === id);
    this.currentId = id;
    this.descripcion.setValue(model?.descripción);
    this.estado.setValue(model?.estado);
    this.modalService.open(modalContent, { ariaLabelledBy: 'modalTitle' });
  }

  openCreateModal(modalContent: any): void {
    this.currentId = 0;
    this.descripcion.setValue('');
    this.estado.setValue(false);
    this.modalService.open(modalContent, { ariaLabelledBy: 'modalTitle' });
  }

  saveChanges(): void {
    const update = {
      id: this.currentId,
      nombre: this.descripcion.value,
      estado: this.estado.value,
    } as ActualizarRestriccionLavadoDto;
    if (update.idRestriccionLavados === 0) {
      this.service.apiRestriccionDeLavadoCrearrestriccionlavadoPost(update)
        .subscribe(
          response => {
            const created = response.datos ?? {};
            this.model = [created, ...this.model];
            this.filterData('');
            this.modalService.dismissAll();
            Swal.fire(
              `¡Creación exitosa!`,
              `El registro se creó con éxito.`,
              'success'
            );
            this.count = this.filteredData.length;
            this.totalPages = Math.ceil(this.count / this.itemsPerPage);
            this.updatePagination();
            this.updatePaginatedData();
          }
        )
    } else {
      this.service.apiRestriccionDeLavadoActualizarrestriccionlavadoPut(update)
        .subscribe(
          _ => {
            const toUpdate = this.model.find(x => x.id === this.currentId);
            const updated = {
              id: toUpdate?.id,
              nombre: this.descripcion.value,
              estado: this.estado.value,
              fechaCreacion: toUpdate?.fechaCreacion,
            } as RestriccionLavadoDto;
            this.model = [updated, ...this.model.filter(x => x.id !== this.currentId)];
            this.filterData('');
            this.modalService.dismissAll();
            Swal.fire(
              `¡Actualización exitosa!`,
              `El registro se actualizó con éxito.`,
              'success'
            );
            this.count = this.filteredData.length;
            this.totalPages = Math.ceil(this.count / this.itemsPerPage);
            this.updatePagination();
            this.updatePaginatedData();
          },
          error => {
            console.error(error);
          }
        );
    }
  }

  changeItemsPerPage(): void {
    this.totalPages = Math.ceil(this.count / this.itemsPerPage);
    this.currentPage = 1;
    this.updatePaginatedData();
    this.updatePagination();
  }

  updatePaginatedData(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedData = this.filteredData.slice(startIndex, endIndex);
  }

  updatePagination(): void {
    const maxVisiblePages = 10;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    this.pages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  }

  exportToExcel(): void {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.model);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Restricciones de lavado');
    XLSX.writeFile(wb, 'restricciones_lavado.xlsx');
  }

  eliminarRegistro(){
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'de eliminar el registro',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {

      }
    });
  }

  actualizar(){
    this.formGroup = this.fb.group({
      codigo: ['1', Validators.required],
      descripcion: ['Lavado Final AVENA', Validators.required],
      familia: ['Familia', Validators.required],
      tipo: ['Lavado Final', Validators.required],
      frecuencia: ['3360', Validators.required],
      tiempo: ['40', Validators.required],
      equipo: ['MQ0014', Validators.required],
      estado: [true, Validators.required],
    });
  }
}
