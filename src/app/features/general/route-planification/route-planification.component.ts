import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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

  constructor(
    private historicoRutasService: HistoricoRutasService,
    private router: Router,
  ) { }

  ngOnInit(): void {
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
      this.currentPage = 1;
      this.data = response.datos?.data ?? [];
      this.totalPages = Math.ceil(response.datos.totalItemCount ?? 0 / this.itemsPerPage);
      this.updatePagination();
    }
  }

  private handleErrorResponse(error: any): void {
    if (error.status === 400 || error.status === 401) {
      Swal.fire({
        title: 'Error',
        text: error.error,
        icon: 'error'
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
    this.getData();
  }
}
