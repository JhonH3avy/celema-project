import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FamiliaProductoDto, FamiliaProductosService } from 'src/app/core/services';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-product-family-admin',
  templateUrl: './product-family-admin.component.html',
  styleUrls: ['./product-family-admin.component.css']
})
export class ProductFamilyAdminComponent implements OnInit {

  productFamilyCount = 0;

  itemsPerPage = 10;
  currentPage = 1;
  totalPages = 5;
  pages: number[] = [];

  searchQuery = new FormControl();

  productFamilies: FamiliaProductoDto[] = [];
  filteredData: FamiliaProductoDto[] = [];
  paginatedData: FamiliaProductoDto[] = [];

  constructor(
    private productFamilyService: FamiliaProductosService,
  ) { }

  ngOnInit(): void {
    this.getData();
    this.searchQuery.valueChanges.subscribe(query => this.filterData(query));
  }

  getData(): void {
    this.productFamilyService.apiFamiliaProductosListadodefamiliaGet()
      .subscribe(response => {
        this.currentPage = 1;
        this.productFamilies = response.datos ?? [];
        this.filteredData = this.productFamilies;
        this.productFamilyCount = this.filteredData.length;
        this.totalPages = Math.ceil(this.productFamilyCount / this.itemsPerPage);
        this.updatePagination();
        this.updatePaginatedData();
      });
  }

  filterData(query: string): void {
    if (query.trim() === '') {
      this.filteredData = this.productFamilies;
    } else {
      this.filteredData = this.productFamilies.filter(productFamily =>
        productFamily.nombre?.toLowerCase().includes(query.toLowerCase())
      );
      this.currentPage = 1;
    }
    this.productFamilyCount = this.filteredData.length;
    this.totalPages = Math.ceil(this.productFamilyCount / this.itemsPerPage);
    this.updatePagination();
    this.updatePaginatedData();
  }

  getStatusStyle(status: boolean | undefined): string[] {
    switch (status) {
      case true: return ['border-success', 'text-success', 'bg-success-subtle'];
      case false: return ['border-danger', ' text-danger', 'bg-danger-subtle'];
      default: return [];
    }
  }

  changePage(pageToLoad: number): void {
    this.currentPage = pageToLoad;
    this.updatePaginatedData();
  }

  changeItemsPerPage(): void {
    this.totalPages = Math.ceil(this.productFamilyCount / this.itemsPerPage);
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
    for (let i = 1; i <= this.totalPages; i++) {
      this.pages.push(i);
    }
  }

  exportToExcel(): void {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.productFamilies);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Roles');
    XLSX.writeFile(wb, 'familia_productos.xlsx');
  }
}
