import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgbModal, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TblPrediccionRutaYTblRutaDto, TblPrediccionRutaYTblRutaService } from 'src/app/core/services';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-route-planification-detail',
  templateUrl: './route-planification-detail.component.html',
  styleUrl: './route-planification-detail.component.css'
})
export class RoutePlanificationDetailComponent {
  currentPage = 1;
  totalPages = 5;
  itemsPerPage = 10;
  offsetPagesToDisplay = 5;
  pages: number[] = [];

  data: TblPrediccionRutaYTblRutaDto[] = [];

  currentPlan: TblPrediccionRutaYTblRutaDto | null = null;

  semanaControl = new FormControl();

  semanaChooseModalRef: NgbModalRef | null = null;

  loading = false;

  constructor(
    private modalService: NgbModal,
    private routePlanificationDetailService: TblPrediccionRutaYTblRutaService,
  ) {
  }

  ngOnInit(): void {
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
              text: 'Sucedió un error inseperado al traer las predicciones de rutas',
              icon: 'error',
            });
          }
        }, () => {
          this.loading = false;
        }
      );
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
    this.getData();
    this.updatePagination();
  }

  openModal(modalContent: any): void {
    const modalOptions = { size: 'lg', backdrop: 'static', centered: true } as NgbModalOptions;
    this.modalService.open(modalContent, modalOptions);
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

  selectPlan(plan: TblPrediccionRutaYTblRutaDto): void {    
    this.currentPlan = plan;
  }
}
