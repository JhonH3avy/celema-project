import { PercentPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CrearHistoricoRutasDto, HistoricoRutasService, Int32ReferenceDto, TblPrediccionRutaYTblRutaDto, TblPrediccionRutaYTblRutaService } from 'src/app/core/services';
import { PrioritizationService } from 'src/app/core/services/prioritization.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-route-planification-detail',
  templateUrl: './route-planification-detail.component.html',
  styleUrl: './route-planification-detail.component.css'
})
export class RoutePlanificationDetailComponent {
  currentPage = 1;
  historicoCurrentPage = 1;
  totalPages = 1;
  historicoTotalPages = 1;
  itemsPerPage = 10;
  historicoItemsPerPage = 10;
  offsetPagesToDisplay = 5;
  historicoOffsetPagesToDisplay = 3;
  pages: number[] = [];
  historicoPages: number[] = [];

  data: TblPrediccionRutaYTblRutaDto[] = [];
  historicoData: string[] = [];

  semanaControl = new FormControl();

  semanaChooseModalRef: NgbModalRef | null = null;
  historicoModalRef: NgbModalRef | null = null;

  familiasInSemana: Int32ReferenceDto[] = [];

  familiaFilterControl = new FormControl<number>(0);

  loading = false;
  historicoLoading = false;

  familySelections: { [idFamilia: number]: number | undefined } = {};
  pageSizes = [10, 15, 50];

  constructor(
    private modalService: NgbModal,
    private routePlanificationDetailService: TblPrediccionRutaYTblRutaService,
    private historicoRutaService: HistoricoRutasService,
    private percentPipe: PercentPipe,
    private prioritizationService: PrioritizationService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.familiaFilterControl.valueChanges
      .subscribe(value => {
        this.currentPage = 1;
        this.filterData(value);
      });
  }

  updateItemsPerPage(): void {
    this.currentPage = 1; // Reinicia a la primera página al cambiar la cantidad de elementos
    this.getData(); // Vuelve a cargar los datos con la nueva cantidad
  }

  getData(): void {
    this.loading = true;
    this.routePlanificationDetailService.apiTblPrediccionRutaYTblRutaObtenerRutasPrediccionesPaginadasGet(this.semanaControl.value, this.currentPage, this.itemsPerPage)
      .subscribe(
        response => {
          this.data = response.datos ?? [];
          this.totalPages = response.totalPaginas ?? 0;
          this.semanaChooseModalRef?.dismiss();
          this.updatePagination();
          this.loading = false;
          this.routePlanificationDetailService.apiTblPrediccionRutaYTblRutaFamiliasReferencesBySemanaGet(this.semanaControl.value)
            .subscribe(response => {
              this.familiasInSemana = response.datos ?? [];
            });
        }, error => {
          if (error.status === 400 || error.status === 404) {
            Swal.fire({
              title: 'Error',
              text: error.error,
              icon: 'error',
            });
          } else {
            Swal.fire({
              title: 'Error',
              text: 'Sucedió un error inesperado al traer las predicciones de rutas',
              icon: 'error',
            });
          }
          this.loading = false;
        }
      );
  }

  filterData(idFamilia: number | null): void {
    if (this.familiaFilterControl.value === 0 || idFamilia == null) {
      this.getData();
    } else {
      this.routePlanificationDetailService.apiTblPrediccionRutaYTblRutaFiltrarRutasPorSemanaYFamiliaPaginadasGet(this.semanaControl.value, idFamilia, '' //TODO: Add query filter here
        , this.currentPage, this.itemsPerPage)
        .subscribe(
          response => {
            this.data = response.datos ?? [];
            this.totalPages = response.totalPaginas ?? 0;
            this.updatePagination();
            this.loading = false;

            const selectedRouteId = this.familySelections[idFamilia];
            if (selectedRouteId !== undefined) {
              const selectedPlan = this.data.find(x => x.id === selectedRouteId);
              if (selectedPlan) {
                selectedPlan.seleccionado = true;
              }
            }
          }, error => {
            if (error.status === 400 || error.status === 404) {
              Swal.fire({
                title: 'Error',
                text: error.error,
                icon: 'error',
              });
            } else {
              Swal.fire({
                title: 'Error',
                text: 'Sucedió un error inesperado al traer las predicciones de rutas',
                icon: 'error',
              });
            }
            this.loading = false;
          }
        );
    }
  }

  selectPlan(plan: TblPrediccionRutaYTblRutaDto): void {
    this.data.filter(x => x.idFamilia === plan.idFamilia).forEach(x => x.seleccionado = false);
    plan.seleccionado = true;

    this.familySelections[plan.idFamilia?? 0] = plan.id;
  }

  isAnyPlanSelected(): boolean {
    return this.data.some(x => x.seleccionado);
  }

  getSpecificSemanaData(semana: string): void {
    this.semanaControl.setValue(semana);
    this.loadHistoricoData();
    this.historicoModalRef?.dismiss();
  }

  getHistoricoData(): void {
    this.routePlanificationDetailService.apiTblPrediccionRutaYTblRutaHistoricoRutasGet(this.historicoCurrentPage, this.historicoItemsPerPage)
      .subscribe(response => {
        this.historicoData = response.datos?.data ?? [];
        this.familiasInSemana = [];
        this.historicoTotalPages = (response.datos?.totalItemCount ?? 0) / this.historicoItemsPerPage;
        this.updateHistoricoPagination();
      }, error => {
        if (error.status === 404) {
          Swal.fire({
            title: 'No hay información',
            text: error.error,
            icon: 'info',
          });
        } else {
          Swal.fire({
            title: 'Error',
            text: 'Sucedió un error inesperado al traer las predicciones de rutas',
            icon: 'error',
          });
        }
      });
  }

  loadHistoricoData(): void {
    this.currentPage = 1;
    this.routePlanificationDetailService.apiTblPrediccionRutaYTblRutaHistoricoBySemanaGet(this.semanaControl.value, this.currentPage, this.itemsPerPage)
      .subscribe(response => {
        this.data = response.datos ?? [];
        this.totalPages = response.totalPaginas ?? 0;
        this.updatePagination();
      })
  }

  getStatusStyle(status: string): string[] {
    switch (status) {
      case 'OK': return ['border-success', 'text-success', 'bg-success-subtle'];
      case 'OFF': return ['border-danger', ' text-danger', 'bg-danger-subtle'];
      default: return [];
    }
  }

  // changePage(pageToLoad: number): void {
  //   this.currentPage = pageToLoad;
  //   this.data = [];
  //   this.filterData(this.familiaFilterControl.value);
  //   this.updatePagination();
  // }

  changePage(pageToLoad: number): void {
    if (pageToLoad < 1 || pageToLoad > this.totalPages) return;

    this.currentPage = pageToLoad;
    this.data = [];
    this.filterData(this.familiaFilterControl.value);
    this.updatePagination();
  }


  changeHistoricoPage(pageToLoad: number): void {
    this.historicoCurrentPage = pageToLoad;
    this.historicoData = [];
    this.getHistoricoData();
    this.updateHistoricoPagination();
  }

  openModal(modalContent: any): void {
    const modalOptions = { size: 'lg', backdrop: 'static', centered: true } as NgbModalOptions;
    this.historicoModalRef = this.modalService.open(modalContent, modalOptions);
    this.getHistoricoData();
  }

  openSemanaChooseModal(modalContent: any): void {
    this.semanaControl.setValue('');
    this.semanaChooseModalRef = this.modalService.open(modalContent);
  }

  // updatePagination(): void {
  //   this.pages = [];
  //   const initialPage = Math.max(1, this.currentPage - this.offsetPagesToDisplay);
  //   const negativeOffset = this.currentPage - this.offsetPagesToDisplay < 0 ? this.currentPage - this.offsetPagesToDisplay : 0;
  //   const finalPage = Math.min(this.totalPages, this.currentPage + this.offsetPagesToDisplay - negativeOffset);
  //   for (let i = initialPage; i <= finalPage; i++) {
  //     this.pages.push(i);
  //   }
  // }

  updatePagination(): void {
    this.pages = [];
    const total = this.totalPages;
    const maxVisiblePages = 10;

    if (total <= maxVisiblePages) {
      // Si hay 10 páginas o menos, se muestran todas
      for (let i = 1; i <= total; i++) {
        this.pages.push(i);
      }
    } else {
      // Si hay más de 10 páginas
      const start = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
      const end = Math.min(total, start + maxVisiblePages - 1);

      if (start > 1) {
        this.pages.push(1); // Botón "Primero"
        if (start > 2) this.pages.push(-1); // "..."
      }

      for (let i = start; i <= end; i++) {
        this.pages.push(i);
      }

      if (end < total) {
        if (end < total - 1) this.pages.push(-1); // "..."
        this.pages.push(total); // Botón "Último"
      }
    }
  }


  updateHistoricoPagination(): void {
    this.historicoPages = [];
    const initialPage = Math.max(1, this.historicoCurrentPage - this.historicoOffsetPagesToDisplay);
    const negativeOffset = this.historicoCurrentPage - this.historicoOffsetPagesToDisplay < 0 ? this.historicoCurrentPage - this.historicoOffsetPagesToDisplay : 0;
    const finalPage = Math.min(this.historicoTotalPages, this.historicoCurrentPage + this.historicoOffsetPagesToDisplay - negativeOffset);
    for (let i = initialPage; i <= finalPage; i++) {
      this.historicoPages.push(i);
    }
  }

  saveHistoricoData(): void {
    const saveHistoricoDataRequests = this.data.filter(x => x.seleccionado).map(h => {
      return {
        idFamilia: h.idFamilia,
        idRuta: h.id,
        semanaProduccion: this.semanaControl.value,
        rutaElegida: h.seleccionado,
        sugerencia: h.sugerencia,
        precision: h.precision,
      } as CrearHistoricoRutasDto;
    });
    this.historicoRutaService.apiHistoricoRutasPost(saveHistoricoDataRequests)
      .subscribe(response => {
        if (response.exito) {
          Swal.fire({
            title: 'Éxito',
            text: response.exito,
            icon: 'success',
          });
        } else {
          Swal.fire({
            title: 'Éxito',
            text: 'Operación exitosa',
            icon: 'success',
          });
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
            text: 'Ha ocurrido un error inesperado',
            icon: 'error',
          });
        }
      });
  }

  formatPercent(percent: number): string {
    if (percent === 0) {
      return 'N/A';
    } else {
      return this.percentPipe.transform(percent) ?? '';
    }
  }

  prioritizeProducts(): void {
    this.prioritizationService.saveRoutePlanificationsForPrioritization(this.data.filter(x => x.seleccionado).map(x => {
      return {
        familyId: x.idFamilia!,
        routeId: x.id!,
      };
    }), this.semanaControl.value);
    this.router.navigate(['/planificacion-rutas-priorizacion']);
  }
}
