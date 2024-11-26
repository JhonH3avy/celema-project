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

  checkedProducts: {checked: boolean, id: number}[] = [];

  constructor(
    private productFamilyService: FamiliaProductosService,
  ) { }

  ngOnInit(): void {
    this.getData();
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

  filterData(): void {
    const query = this.searchQuery.value;
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
    this.paginatedData = this.filteredData.slice(startIndex, endIndex);
    this.checkedProducts = this.paginatedData.map(p => {
      return {
        checked: false,
        id: p.id!,
      };
    });
  }

  updatePagination(): void {
    this.pages = [];
    for (let i = 1; i <= this.totalPages; i++) {
      this.pages.push(i);
    }
  }

  exportToExcel(): void {
    let target: FamiliaProductoDto[] = [];
    if (this.checkedProducts.filter(x => x.checked).length > 0) {
      target = this.productFamilies.filter(x => this.checkedProducts.filter(x => x.checked).some(c => x.id === c.id));
    } else {
      target = this.productFamilies;
    }
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(target);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Roles');
    XLSX.writeFile(wb, 'familia_productos.xlsx');
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
    return this.checkedProducts.every((item) => item.checked);
  }

  isChecked(id: number) {
    return this.checkedProducts.find(x => x.id === id)?.checked;
  }
}
