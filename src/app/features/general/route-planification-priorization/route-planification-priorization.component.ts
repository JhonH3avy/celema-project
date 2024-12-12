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

  checkedProducts: {checked: boolean, id: string}[] = [];
  totalPages = 1;
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
            this.itemCount = this.data.length;
            this.totalPages = Math.ceil(this.data.length / this.itemsPerPage);
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

  updatePagination(): void {
    this.pages = [];
    const initialPage = Math.max(1, this.currentPage - this.offsetPagesToDisplay);
    const negativeOffset = this.currentPage - this.offsetPagesToDisplay < 0 ? this.currentPage - this.offsetPagesToDisplay : 0;
    const finalPage = Math.min(this.totalPages, this.currentPage + this.offsetPagesToDisplay - negativeOffset);
    for (let i = initialPage; i <= finalPage; i++) {
      this.pages.push(i);
    }
  }

  updatePaginatedData(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedData = this.filteredData.slice(startIndex, endIndex);
    this.checkedProducts = this.paginatedData.map(p => {
      return {
        checked: false,
        id: (p.idMaquina + '-' + p.ejecucion),
      };
    });
  }

  exportToExcel(): void {
    let target: ProductRoutePrioritizationDto[] = [];
    if (this.checkedProducts.filter(x => x.checked).length > 0) {
      target = this.data.filter(x => this.checkedProducts.filter(x => x.checked).some(c => (x.idMaquina + '-' + x.ejecucion) === c.id));
    } else {
      target = this.data;
    }
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(target);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Planificación Rutas');
    XLSX.writeFile(wb, 'planificacion_rutas.xlsx');
  }

  toggleAll(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.checkedProducts.forEach((item) => (item.checked = checked));
  }

  updateSelectAll(event: Event, id: string): void {
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

  isChecked(id: string) {
    return this.checkedProducts.find(x => x.id === id)?.checked;
  }
}
