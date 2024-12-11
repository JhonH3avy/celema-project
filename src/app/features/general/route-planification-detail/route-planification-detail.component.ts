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

  constructor(
    private modalService: NgbModal,
    private routePlanificationDetailService: TblPrediccionRutaYTblRutaService,
    private historicoRutaService: HistoricoRutasService,
    private percentPipe: PercentPipe,
    private prioritizationService: PrioritizationService,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    this.familiaFilterControl.valueChanges
      .subscribe(value => {
        this.currentPage = 1;
        this.filterData(value);
      });
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
              text: 'Sucedió un error inseperado al traer las predicciones de rutas',
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
      this.routePlanificationDetailService.apiTblPrediccionRutaYTblRutaFiltrarRutasPorSemanaYFamiliaPaginadasGet(this.semanaControl.value, idFamilia, this.currentPage, this.itemsPerPage)
      .subscribe(
        response => {
          this.data = response.datos ?? [];
          this.totalPages = response.totalPaginas ?? 0;
          this.updatePagination();
          this.loading = false;
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
              text: 'Sucedió un error inseperado al traer las predicciones de rutas',
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
            title: 'Error',
            text: error.error,
            icon: 'error',
          });
        } else {
          Swal.fire({
            title: 'Error',
            text: 'Sucedió un error inseperado al traer las predicciones de rutas',
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

  changePage(pageToLoad: number): void {
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

  updatePagination(): void {
    this.pages = [];
    const initialPage = Math.max(1, this.currentPage - this.offsetPagesToDisplay);
    const negativeOffset = this.currentPage - this.offsetPagesToDisplay < 0 ? this.currentPage - this.offsetPagesToDisplay : 0;
    const finalPage = Math.min(this.totalPages, this.currentPage + this.offsetPagesToDisplay - negativeOffset);
    for (let i = initialPage; i <= finalPage; i++) {
      this.pages.push(i);
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
    this.prioritizationService.saveRoutePlanificationsForPrioritization(this.data.filter(x => x.seleccionado).map(x => x.idFamilia!), this.semanaControl.value);
    this.router.navigate(['/planificacion-rutas-priorizacion']);
  }
}
