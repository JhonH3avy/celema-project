import { Component, OnInit } from '@angular/core';
import { HistoricoRutaDto, HistoricoRutaDtoPaginatedDataDataResponse, HistoricoRutasService } from 'src/app/core/services';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-route-planification',
  templateUrl: './route-planification.component.html',
  styleUrls: ['./route-planification.component.css']
})
export class RoutePlanificationComponent implements OnInit {

  currentPage = 1;
  totalPages = 1;
  itemsPerPage = 10;
  pages: number[] = [];
  offsetPagesToDisplay = 5;

  data: HistoricoRutaDto[] = [];
  searchQuery = new FormControl();

  checkedProducts: {checked: boolean, id: number}[] = [];

  constructor(
    private historicoRutasService: HistoricoRutasService,
  ) { }

  ngOnInit(): void {
    this.currentPage = 1;
    this.getData();
  }

  getData(): void {
    this.historicoRutasService.apiHistoricoRutasGet(this.currentPage, this.itemsPerPage)
      .subscribe(
        response => this.handleDataResponse(response),
        error => this.handleErrorResponse(error)
      );
  }

  private handleDataResponse(response: HistoricoRutaDtoPaginatedDataDataResponse): void {
    if (response.datos) {
      this.data = response.datos?.data ?? [];
      this.totalPages = Math.ceil((response.datos.totalItemCount ?? 0) / this.itemsPerPage);
      this.checkedProducts = this.data.map(x => {
        return {
          id: x.idRuta!,
          checked: false,
        };
      });
      this.updatePagination();
    }
  }

  private handleErrorResponse(error: any): void {
    if (error.status === 400) {
      Swal.fire({
        title: 'Error',
        text: error.error,
        icon: 'error'
      });
    } else if (error.status === 404) {
      Swal.fire({
        title: 'No hay planeación',
        text: error.error,
        icon: 'info'
      });
    } else {
      Swal.fire({
        title: 'Error',
        text: 'Un error inesperado ha ocurrido con la petición',
        icon: 'error'
      });
    }
  }

  filterData(): void {
    const filter = this.searchQuery.value;
    if (filter) {
      this.historicoRutasService.apiHistoricoRutasFilterGet(this.currentPage, this.itemsPerPage, filter)
        .subscribe(
          response => this.handleDataResponse(response),
          error => this.handleErrorResponse(error)
        );
    } else {
      this.getData();
    }
  }

  getStatusStyle(status: boolean): string[] {
    switch (status) {
      case true: return ['border-success', 'text-success', 'bg-success-subtle'];
      case false: return ['border-danger', ' text-danger', 'bg-danger-subtle'];
      default: return [];
    }
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

  changePage(pageToLoad: number): void {
    this.currentPage = pageToLoad;
    const filter = this.searchQuery.value;
    if (filter) {
      this.filterData();
    } else {
      this.getData();
    }
  }

  exportToExcel(): void {
    let target: HistoricoRutaDto[] = [];
    if (this.checkedProducts.filter(x => x.checked).length > 0) {
      target = this.data.filter(x => this.checkedProducts.filter(x => x.checked).some(c => x.idRuta === c.id));
    } else {
      target = this.data;
    }
    const processedData = target.map(x => {
      return {
        ...x,
        listaEquipos: x.equipmentList?.join(','),
      };
    });
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(processedData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Planeación Rutas');
    XLSX.writeFile(wb, 'planeacion_rutas.xlsx');
  }

  toggleAll(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.checkedProducts.forEach((item) => (item.checked = checked));
  }

  updateSelectAll(event: Event, id: number): void {
    const checked = (event.target as HTMLInputElement).checked;
    const productCheck = this.checkedProducts.find(x => x.id === id);
    if (productCheck) {
      productCheck.checked = checked;
    }
  }

  isAllChecked(): boolean {
    if (this.checkedProducts.length === 0) {
      return false;
    }
    return this.checkedProducts.every((item) => item.checked);
  }

  isChecked(id: number) {
    return this.checkedProducts.find(x => x.id === id)?.checked;
  }
}
