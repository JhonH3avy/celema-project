import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { PriorizacionRutasService, ProductRoutePrioritizationDto } from 'src/app/core/services';
import { PrioritizationService } from 'src/app/core/services/prioritization.service';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-route-planification-priorization',
  templateUrl: './route-planification-priorization.component.html',
  styleUrl: './route-planification-priorization.component.css'
})
export class RoutePlanificationPriorizationComponent {
  loading = false;
  currentPage = 1;
  itemCount = 0;
  private offsetPagesToDisplay = 5;
  pages: number[] = [];

  data: ProductRoutePrioritizationDto[] = [];
  paginatedData: ProductRoutePrioritizationDto[] = [];
  filteredData: ProductRoutePrioritizationDto[] = [];
  totalPages = 1;
  itemsPerPageControl = new FormControl(10);
  itemsPerPage = 10;

  checkedProducts: { [key: string]: boolean } = {};

  constructor(
    private prioritizationService: PrioritizationService,
    private priorizacionRutas: PriorizacionRutasService,
    private router: Router,
  ) {
   }

  ngOnInit(): void {
    this.getData();
  }

  getData(): void {
    const request = this.prioritizationService.getInitialRequestToPrioritizeRoutes();
    if (request.productFamilyRoutePrioritizations && request.productFamilyRoutePrioritizations.length > 0 && request.semana) {
      this.priorizacionRutas.apiPriorizacionRutasPost(request)
        .subscribe(response => {
          if (response.datos) {
            this.data = response.datos ?? [];
            this.filteredData = this.data;
            this.itemCount = this.filteredData.length;
            this.totalPages = Math.ceil(this.filteredData.length / this.itemsPerPage);
            this.updatePagination();
            this.updatePaginatedData();
          }
        }, error => {
          if (error.status === 400) {
            Swal.fire({
              title: 'Error',
              text: error.error,
              icon: 'error',
            });
          } else {
            Swal.fire({
              title: 'Error',
              text: 'Un error inesperado ha ocurrido al intentar priorizar las rutas',
              icon: 'error',
            });
          }
        });
    } else {
      Swal.fire({
        title: 'No hay información',
        text: 'No se ha seleccionado rutas para priorizar',
        icon: 'warning',
      }).then(() => {
        this.router.navigate(['/planificacion-rutas-detalle'])
      });
    }
  }

  saveData(): void {
    this.loading = true;
    this.priorizacionRutas.apiPriorizacionRutasSavePost(this.data)
      .subscribe(response => {
        if (response.datos) {
          Swal.fire({
            title: 'Éxito',
            text: response.exito ?? 'Guardado exitoso',
            icon: 'success',
          });
        }
        this.loading = false;
      }, error => {
        if (error.status == 400) {
          Swal.fire({
            title: 'Error',
            text: error.errror,
            icon: 'error',
          });
        } else {
          Swal.fire({
            title: 'Error',
            text: 'Ha ocurrido un error inesperado al guardar la priorización',
            icon: 'error',
          });
        }
        this.loading = false;
      });
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
      this.updatePaginatedData();
    }
  }

  changeItemsPerPage(): void {
    this.totalPages = Math.ceil(this.filteredData.length / this.itemsPerPage);
    this.currentPage = 1;
    this.updatePaginatedData();
    this.updatePagination();
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


  updatePaginatedData(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedData = this.filteredData.slice(startIndex, endIndex);
  }


  exportToExcel(): void {
    let target: ProductRoutePrioritizationDto[] = [];
    if (Object.values(this.checkedProducts).some(checked => checked)) {
      target = this.data.filter(x => this.checkedProducts[`${x.idProducto}-${x.idMaquina}-${x.ejecucion}`]);
    } else {
      target = this.data;
    }
    const processedData = target.map(x => {
      return {
        ...x,
        restriccionesLavado: x.restriccionesLavado?.join(','),
        restriccionesMaquina: x.restriccionesMaquina?.join(','),
      };
    });
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(processedData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Planificación Rutas');
    XLSX.writeFile(wb, 'planificacion_rutas.xlsx');
 }


 toggleAll(event: Event): void {
  const checked = (event.target as HTMLInputElement).checked;

  this.paginatedData.forEach((item) => {
    const key = `${item.idProducto}-${item.idMaquina}-${item.ejecucion}`;
    this.checkedProducts[key] = checked;
  });
}

  updateSelectAll(event: Event, id: string): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.checkedProducts[id] = checked;
  }


  isAllChecked(): boolean {
    return this.paginatedData.every((item) => this.checkedProducts[`${item.idProducto}-${item.idMaquina}-${item.ejecucion}`]);
  }


  isChecked(id: string): boolean {
    return this.checkedProducts[id] || false;
  }
}
