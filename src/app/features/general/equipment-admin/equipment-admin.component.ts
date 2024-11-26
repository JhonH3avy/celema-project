import { MaquinasService } from './../../../core/services/api/maquinas.service';
import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import { FormControl } from '@angular/forms';
import { DateOnly, MaquinaDto } from 'src/app/core/services';

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

  data: MaquinaDto[] = [];
  filteredData: MaquinaDto[] = [];
  paginatedData: MaquinaDto[] = [];

  machineRestrictionData: any[] = [];

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
  ) { }

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
    this.paginatedData = this.filteredData.slice(startIndex, endIndex); // Usa filteredData en lugar de data
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

  exportToExcel(): void {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Roles');
    XLSX.writeFile(wb, 'familia_productos.xlsx');
  }


}
