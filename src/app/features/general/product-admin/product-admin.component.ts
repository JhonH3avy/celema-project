import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ProductoDto, ProductosService } from 'src/app/core/services';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-product-admin',
  templateUrl: './product-admin.component.html',
  styleUrls: ['./product-admin.component.css']
})
export class ProductAdminComponent implements OnInit {

  productCount = 0;

  currentPage = 1;
  totalPages = 5;
  pages: number[] = [];

  products: ProductoDto[] = [];
  filteredData: ProductoDto[] = [];
  paginatedData: ProductoDto[] = [];

  itemsPerPageControl = new FormControl(10);
  searchQuery = new FormControl();

  private offsetPagesToDisplay = 5;

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
    private productService: ProductosService,
  ) { }

  ngOnInit(): void {
    this.productCount = this.products.length;
    this.getData();
    this.searchQuery.valueChanges.subscribe(query => this.filterData(query));
  }

  getData(): void {
    this.productService.apiProductosBuscarTodosGet()
      .subscribe(response => {
        this.currentPage = 1;
        this.products = response.datos ?? [];
        this.filteredData = this.products;
        this.productCount = this.filteredData.length;
        this.totalPages = Math.ceil(this.productCount / this.itemsPerPage);
        this.updatePagination();
        this.updatePaginatedData();
      });
  }

  filterData(query: string): void {
    if (query.trim() === '') {
      this.filteredData = this.products;
    } else {
      this.filteredData = this.products.filter(product =>
        product.nombre?.toLowerCase().includes(query.toLowerCase())
      );
      this.currentPage = 1;
    }
    this.productCount = this.filteredData.length;
    this.totalPages = Math.ceil(this.productCount / this.itemsPerPage);
    this.updatePaginatedData();
    this.updatePagination();
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
    this.updatePagination();
  }

  changeItemsPerPage(): void {
    this.totalPages = Math.ceil(this.productCount / this.itemsPerPage);
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
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.products);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Roles');
    XLSX.writeFile(wb, 'productos.xlsx');
  }
}
