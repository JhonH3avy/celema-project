import { Component } from '@angular/core';
import { PriorizacionRutasService, ProductRoutePrioritizationDto } from 'src/app/core/services';
import { PrioritizationService } from 'src/app/core/services/prioritization.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-route-planification-priorization',
  templateUrl: './route-planification-priorization.component.html',
  styleUrl: './route-planification-priorization.component.css'
})
export class RoutePlanificationPriorizationComponent {
  currentPage = 1;
  totalPages = 1;
  itemsPerPage = 10;
  private offsetPagesToDisplay = 5;
  pages: number[] = [];

  data: ProductRoutePrioritizationDto[] = [];

  constructor(
    private prioritizationService: PrioritizationService,
    private priorizacionRutas: PriorizacionRutasService,
  ) {
   }

  ngOnInit(): void {
    this.getData();
  }

  getData(): void {
    const request = this.prioritizationService.getInitialRequestToPrioritizeRoutes();
    this.priorizacionRutas.apiPriorizacionRutasPost(request)
      .subscribe(response => {
        if (response.datos) {
          this.data = response.datos ?? [];
          this.totalPages = Math.ceil(this.data.length / this.itemsPerPage);
          this.updatePagination();
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
  }

  changePage(pageToLoad: number): void {
    this.currentPage = pageToLoad;
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
}
