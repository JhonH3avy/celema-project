import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/core/services/api.service';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-profile-admin',
  templateUrl: './profile-admin.component.html',
  styleUrls: ['./profile-admin.component.css']
})
export class ProfileAdminComponent implements OnInit {

  data: any[] = [];
  filteredData: any[] = [];
  paginatedData: any[] = [];
  userCount = 0;
  searchQuery: string = '';

  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 0;
  pages: number[] = [];

  roles = [
    { id: 1, name: 'Administrador' },
    { id: 2, name: 'Lector' },
    { id: 3, name: 'Editor de plan' },
    { id: 4, name: 'Creador' },
    { id: 5, name: 'Temporal' },
  ];

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.getData();
  }

  getProfileAccessStyle(access: string): string[] {
    switch (access) {
      case 'Admin': return ['border-primary', 'text-primary', 'bg-primary-subtle'];
      case 'Editor de plan': return ['border-danger', 'text-danger', 'bg-danger-subtle'];
      case 'Lector': return ['border-success', 'text-success', 'bg-success-subtle'];
      default: return [];
    }
  }

  clearData(){
    this.currentPage = 1;
    this.getData();
    this.searchQuery = '';
  }

  getData() {
    this.apiService.get('Usuarios/listausuarios').subscribe({
      next: (response: any) => {
        this.data = response.datos;
        this.filteredData = this.data;  // Inicializa la data filtrada con todos los datos
        this.userCount = this.filteredData.length;
        this.totalPages = Math.ceil(this.userCount / this.itemsPerPage);
        this.updatePagination();
        this.updatePaginatedData();
        console.log("Esta es la respuesta", response);
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al consultar el servicio.',
          confirmButtonText: 'Aceptar'
        });
      }
    });
  }

  filterData(): void {
    if (this.searchQuery.trim() === '') {
      this.filteredData = this.data;
    } else {
      this.filteredData = this.data.filter(profile =>
        profile.correoElectronico.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        profile.nombre.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        profile.apellido.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
      this.currentPage = 1;
    }
    this.userCount = this.filteredData.length;
    this.totalPages = Math.ceil(this.userCount / this.itemsPerPage);
    this.updatePagination();
    this.updatePaginatedData();
  }

  changePage(pageToLoad: number): void {
    if (pageToLoad < 1 || pageToLoad > this.totalPages) return;
    this.currentPage = pageToLoad;
    this.updatePaginatedData();
  }

  updatePaginatedData(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedData = this.filteredData.slice(startIndex, endIndex); // Usa filteredData en lugar de data
  }

  changeItemsPerPage(): void {
    this.totalPages = Math.ceil(this.userCount / this.itemsPerPage);
    this.currentPage = 1;
    this.updatePaginatedData();
    this.updatePagination();
  }

  updatePagination(): void {
    this.pages = [];
    for (let i = 1; i <= this.totalPages; i++) {
      this.pages.push(i);
    }
  }

  exportToExcel(): void {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.paginatedData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Perfiles');

    XLSX.writeFile(wb, 'perfiles.xlsx');
  }
}

