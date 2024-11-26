import { MaquinasService } from './../../../core/services/api/maquinas.service';
import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import { FormControl } from '@angular/forms';
import { ActualizarRestriccionLavadoDto, ActualizarRestriccionMaquinaDto, DateOnly, MaquinaDto, RestriccionDeLavadoService, RestriccionLavadoDto, RestriccionMaquinaDto, RestriccionMaquinasService } from 'src/app/core/services';
import { NgbModal, NgbModalConfig, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-equipment-admin',
  templateUrl: './equipment-admin.component.html',
  styleUrls: ['./equipment-admin.component.css']
})
export class EquipmentAdminComponent implements OnInit {

  itemCount = 0;

  offsetPagesToDisplay = 5;
  currentPage = 1;
  totalPages = 0;
  pages: number[] = [];

  searchQuery = new FormControl();

  data: MaquinaDto[] = [];
  filteredData: MaquinaDto[] = [];
  paginatedData: MaquinaDto[] = [];

  machineRestrictionData: RestriccionMaquinaDto[] = [];
  washRestrictionData: RestriccionLavadoDto[] = [];

  checkedProducts: {checked: boolean, id: number | string}[] = [];

  equimentRestrictionModalRef: NgbModalRef | null = null;
  washRestrictionModalRef: NgbModalRef | null = null;

  itemsPerPageControl = new FormControl(10);
  private get itemsPerPage(): number {
    const itemsPerPageValue = this.itemsPerPageControl.value;
    if (typeof itemsPerPageValue === 'string') {
      return Number.parseInt(itemsPerPageValue);
    } if (typeof itemsPerPageValue === 'number') {
      return itemsPerPageValue;
    }
    return 0;
  }

  constructor(
    private maquinasService: MaquinasService,
    private modalService: NgbModal,
    private equipmentRestrictionService: RestriccionMaquinasService,
    private washRestrictionService: RestriccionDeLavadoService,
    private config: NgbModalConfig,
  ) {
    this.config.size = 'lg';
  }

  ngOnInit(): void {
    this.getData();
  }

  getData(): void {
    this.maquinasService.apiMaquinasConsultamaquinasGet()
      .subscribe(response => {
        this.currentPage = 1;
        this.data = response.datos ?? [];
        this.filteredData = this.data;
        this.itemCount = this.filteredData.length;
        this.totalPages = Math.ceil(this.itemCount / this.itemsPerPage);
        this.updatePagination();
        this.updatePaginatedData();
      });
  }

  filterData(): void {
    const query = this.searchQuery.value;
    if (query.trim() === '') {
      this.filteredData = this.data;
    } else {
      this.filteredData = this.data.filter(equipment =>
        equipment.nombre?.toLowerCase().includes(query.toLowerCase())
      );
      this.currentPage = 1;
    }
    this.itemCount = this.filteredData.length;
    this.totalPages = Math.ceil(this.itemCount / this.itemsPerPage);
    this.updatePagination();
    this.updatePaginatedData();
  }

  getDateOnlyFormatted(dateOnly: DateOnly | undefined): string {
    if (dateOnly) {
      return `${dateOnly.day}/${dateOnly.month}/${dateOnly.year}`;
    }
    return '';
  }

  getStatusStyle(status: string | undefined): string[] {
    switch (status) {
      case 'ACTIVO': return ['border-success', 'text-success', 'bg-success-subtle'];
      case 'INACTIVO': return ['border-danger', ' text-danger', 'bg-danger-subtle'];
      default: return [];
    }
  }

  changePage(pageToLoad: number): void {
    this.currentPage = pageToLoad;
    this.updatePaginatedData();
  }

  changeItemsPerPage(): void {
    this.totalPages = Math.ceil(this.itemCount / this.itemsPerPage);
    this.currentPage = 1;
    this.updatePaginatedData();
    this.updatePagination();
  }

  updatePaginatedData(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedData = this.filteredData.slice(startIndex, endIndex);
    this.checkedProducts = this.paginatedData.map(p => {
      return {
        checked: false,
        id: p.idMaquina!,
      };
    });
  }

  updatePagination(): void {
    this.pages = [];
    const initialPage = Math.max(1, this.currentPage - this.offsetPagesToDisplay);
    const negativeOffset = this.currentPage - this.offsetPagesToDisplay < 0 ? this.currentPage - this.offsetPagesToDisplay : 0;
    const finalPage = Math.min(this.totalPages, this.currentPage + this.offsetPagesToDisplay - negativeOffset);
    for (let i = initialPage; i <= finalPage; i++) {
      this.pages.push(i);
    }
  }

  openEquipmentRestrictionModal(modalContent: any, equipmentId: string): void {
    this.equipmentRestrictionService.apiRestriccionMaquinasRestriccionPorMaquinaGet(equipmentId)
      .subscribe(response => {
        this.machineRestrictionData = response.datos ?? [];
      });
    this.equimentRestrictionModalRef = this.modalService.open(modalContent);
  }

  closeEquipmentRestrictionModal(): void {
    this.equimentRestrictionModalRef?.dismiss();
    this.equimentRestrictionModalRef = null;
    this.machineRestrictionData = [];
  }

  saveEquipmentRestrictions(): void {
    const requests = this.machineRestrictionData.map(m => {
      return {
        id: m.id,
        descripcion: m.descripcion,
        idFamilia: m.idFamilia,
        idMaquina: m.idMaquina,
        valor: m.valor,
        estado: m.estado,
        prioridad: m.prioridad,
        unidadMedida: m.unidadMedida,
        tipoRestriccion: m.tipoRestriccion,
      } as ActualizarRestriccionMaquinaDto;
    });
    this.equipmentRestrictionService.apiRestriccionMaquinasActualizarRestriccionBatchPut(requests)
      .subscribe(response => {
        if (response.datos) {
          Swal.fire({
            title: 'Éxito',
            text: response.exito ?? 'Actualización exitosa',
            icon: 'success',
          });
        }
      }, error => {
        Swal.fire({
          title: 'Error',
          text: error.error ?? 'Error inesperado durante la actualización de restricciones',
          icon: 'error',
        });
      });
    this.closeEquipmentRestrictionModal();
  }

  openWashRestrictionModal(modalContent: any, equipmentId: string): void {
    this.washRestrictionService.apiRestriccionDeLavadoRestriccionPorMaquinaGet(equipmentId)
      .subscribe(response => {
        this.washRestrictionData = response.datos ?? [];
      });
    this.washRestrictionModalRef = this.modalService.open(modalContent);
  }

  closeWashRestrictionModal(): void {
    this.washRestrictionModalRef?.dismiss();
    this.washRestrictionModalRef = null;
    this.washRestrictionData = [];
  }

  saveWashRestrictions(): void {
    const requests = this.washRestrictionData.map(w => {
      return {
        descripción: w.descripcion,
        estado: w.estado,
        frecuenciaLavado: w.frecuenciaLavado,
        idFamilia: w.idFamilia,
        idRestriccionLavados: w.id,
        prioridad: w.prioridad,
        tiempoLavado: w.tiempoLavado,
        tipoLavado: w.tipoLavado,
      } as ActualizarRestriccionLavadoDto;
    });
    this.washRestrictionService.apiRestriccionDeLavadoActualizarRestriccionBatchPut(requests)
      .subscribe(response => {
        if (response.datos) {
          Swal.fire({
            title: 'Éxito',
            text: response.exito ?? 'Actualización exitosa',
            icon: 'success',
          });
        }
      }, error => {
        Swal.fire({
          title: 'Error',
          text: error.error ?? 'Error inesperado durante la actualización de restricciones',
          icon: 'error',
        });
      });
    this.closeWashRestrictionModal();
  }

  exportToExcel(): void {
    let target: MaquinaDto[] = [];
    if (this.checkedProducts.filter(x => x.checked).length > 0) {
      target = this.data.filter(x => this.checkedProducts.filter(x => x.checked).some(c => x.idMaquina === c.id));
    } else {
      target = this.data;
    }
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(target);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Maquinas');
    XLSX.writeFile(wb, 'maquinas.xlsx');
  }

  toggleAll(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.checkedProducts.forEach((item) => (item.checked = checked));
  }

  updateSelectAll(event: Event, id: number | string): void {
    const checked = (event.target as HTMLInputElement).checked;
    const productCheck = this.checkedProducts.find(x => x.id === id);
    if (productCheck) {
      productCheck.checked = checked;
    }
  }

  isAllChecked(): boolean {
    return this.checkedProducts.every((item) => item.checked);
  }

  isChecked(id: number | string) {
    return this.checkedProducts.find(x => x.id === id)?.checked;
  }
}
