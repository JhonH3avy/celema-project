import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ActualizarRestriccionMaquinaDto, FamiliaProductoDto, FamiliaProductosService, MaquinaDto, MaquinasService, RestriccionMaquinaDto } from 'src/app/core/services';
import { RestriccionMaquinasService } from 'src/app/core/services';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import * as bootstrap from 'bootstrap';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-equipment-restriction',
  templateUrl: './equipment-restriction.component.html',
  styleUrls: ['./equipment-restriction.component.css']
})
export class EquipmentRestrictionComponent implements OnInit {

  currentPage = 1;
  totalPages = 5;
  pages: number[] = [];

  model: RestriccionMaquinaDto[] = [];

  formGroup: FormGroup;
  itemsPerPage = 10;
  count = 0;

  filteredData: RestriccionMaquinaDto[] = [];
  paginatedData: RestriccionMaquinaDto[] = [];

  searchQuery = new FormControl();
  searchQueryText = '';

  currentId = 0;

  lstEquipos : MaquinaDto[] = [];
  lstFamilia : FamiliaProductoDto[] = [];

  get codigo(): FormControl {
    return this.formGroup.controls['codigo'] as FormControl;
  }

  get descripcion(): FormControl {
    return this.formGroup.controls['descripcion'] as FormControl;
  }

  get familia(): FormControl {
    return this.formGroup.controls['familia'] as FormControl;
  }

  get tipoRestriccion(): FormControl {
    return this.formGroup.controls['tipoRestriccion'] as FormControl;
  }

  get unidadMedida(): FormControl {
    return this.formGroup.controls['unidadMedida'] as FormControl;
  }

  get valor(): FormControl {
    return this.formGroup.controls['valor'] as FormControl;
  }

  get equipo(): FormControl {
    return this.formGroup.controls['equipo'] as FormControl;
  }

  get prioridad(): FormControl {
    return this.formGroup.controls['prioridad'] as FormControl;
  }

  get estado(): FormControl {
    return this.formGroup.controls['estado'] as FormControl;
  }

  constructor(
    private service: RestriccionMaquinasService,
    private maquinaService: MaquinasService,
    private familiaService: FamiliaProductosService,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private config: NgbModalConfig,
  ) {
    this.formGroup = this.fb.group({
      codigo: ['0'],
      descripcion: ['', Validators.required],
      familia: ['', Validators.required],
      tipoRestriccion: ['', Validators.required],
      unidadMedida: ['', Validators.required],
      prioridad: ['', Validators.required],
      valor: ['', Validators.required],
      equipo: ['', Validators.required],
      estado: [true],
    });
    config.size = 'lg';
  }

  ngOnInit(): void {
    this.maquinaService.apiMaquinasConsultamaquinasGet()
    .subscribe(response => {
      this.lstEquipos = response.datos ?? [];
    });

    this.familiaService.apiFamiliaProductosListadodefamiliaGet()
    .subscribe(response => {
      this.lstFamilia = response.datos ?? [];
    });

    this.getData();
    this.searchQuery.valueChanges.subscribe(query => this.filterData(query));

  }

  obtenerFiltro(event: Event){
    const inputValue = (event.target as HTMLInputElement).value;
    this.searchQueryText = inputValue;
  }

  filtrar(){
    this.filterData(this.searchQueryText);
  }

  getData(): void {
    this.service.apiRestriccionMaquinasListaRestriccionMaquinasGet()
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
        role.descripcion?.toLowerCase().includes(query.toLowerCase())
      );
      this.currentPage = 1;
    }
    this.count = this.filteredData.length;
    this.totalPages = Math.ceil(this.count / this.itemsPerPage);
    this.updatePagination();
    this.updatePaginatedData();
  }

  clearData(){
    this.currentPage = 1;
    this.getData();
    this.searchQueryText = '';

    const buscador = document.getElementById('buscador') as HTMLInputElement;
    buscador.value = '';
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
    this.formGroup.reset();
    this.currentId = 0;
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

  onSubmit(): void {

    if (this.currentId === 0) {

      let update = {
        id: this.currentId,
        descripcion: this.descripcion.value,
        idFamilia: this.familia.value,
        tipoRestriccion: this.tipoRestriccion.value,
        unidadMedida: this.unidadMedida.value,
        valor: this.valor.value,
        prioridad: this.prioridad.value,
        estado: true,
        idMaquina: this.equipo.value
      } as ActualizarRestriccionMaquinaDto;

      this.service.apiRestriccionMaquinasCrearRestriccionMaquinasPost(update)
        .subscribe(
          response => {
            this.getData();
            this.modalService.dismissAll();
            Swal.fire(
              `¡Creación exitosa!`,
              `El registro se creó con éxito.`,
              'success'
            );
          }
        )
    } else {

      let update = {
        id: this.currentId,
        descripcion: this.descripcion.value,
        idFamilia: this.familia.value,
        tipoRestriccion: this.tipoRestriccion.value,
        unidadMedida: this.unidadMedida.value,
        valor: this.valor.value,
        prioridad: this.prioridad.value,
        estado: this.estado.value,
        idMaquina: this.equipo.value
      } as ActualizarRestriccionMaquinaDto;

      this.service.apiRestriccionMaquinasActualizarRestriccionMaquinasPut(update)
        .subscribe(
          _ => {
            this.getData();
            this.modalService.dismissAll();
            Swal.fire(
              `¡Actualización exitosa!`,
              `El registro se actualizó con éxito.`,
              'success'
            );
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
    XLSX.utils.book_append_sheet(wb, ws, 'Restricciones Maquina');
    XLSX.writeFile(wb, 'restricciones_maquina.xlsx');
  }

  eliminarRegistro(id: number, activo:any){

    let mensaje = activo == false ?'Activar' : 'Desactivar';
    let mensajeAux = activo == false ?'activo' : 'desactivo';

    Swal.fire({
      title: '¿Estás seguro?',
      text: mensaje + ' el registro',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, ' + mensaje,
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
          this.service.apiRestriccionMaquinasEliminarRestriccionMaquinaIdPatch(id)
        .subscribe(
          _ => {
            this.modalService.dismissAll();
            this.getData();
            Swal.fire(
              activo == false ? 'Activado' : 'Desactivado!',
              'El registro se '+ mensajeAux +' con exito.',
              'success'
            );
          },
          error => {
            Swal.fire('Error', 'Hubo un error al desactivar el registro.', 'error');
          }
        );
      }
      }
    );
  }

  actualizar(model: RestriccionMaquinaDto){
    this.currentId = model.id!;
    this.formGroup = this.fb.group({
      codigo: [model.id!],
      descripcion: [model.descripcion!, Validators.required],
      familia: [model.idFamilia!, Validators.required],
      tipoRestriccion: [model.tipoRestriccion!, Validators.required],
      unidadMedida: [model.unidadMedida!, Validators.required],
      valor: [model.valor!, Validators.required],
      prioridad: [model.prioridad!, Validators.required],
      equipo: [model.idMaquina!, Validators.required],
      estado: [model.estado]
    });
  }

}
