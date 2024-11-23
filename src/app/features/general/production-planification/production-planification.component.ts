import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PlaneacionProduccionDto, PlaneacionProduccionService } from 'src/app/core/services';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-production-planification',
  templateUrl: './production-planification.component.html',
  styleUrl: './production-planification.component.css'
})
export class ProductionPlanificationComponent {
  FormGroup: FormGroup;
  itemCount = 0;
  offsetPagesToDisplay = 5;

  currentPage = 1;
  totalPages = 5;
  pages: number[] = [];
  currentStep: number = 1;
  fileName: string = '';

  productionPlanifications: PlaneacionProduccionDto[] = [];
  filteredData: PlaneacionProduccionDto[] = [];
  paginatedData: PlaneacionProduccionDto[] = [];

  itemsPerPageControl = new FormControl(10);
  searchQuery = new FormControl();

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
    private modalService: NgbModal,
    private fb: FormBuilder,
    private planeacionProduccionService: PlaneacionProduccionService) {
    this.FormGroup = this.fb.group({

    });
   }

  ngOnInit(): void {
    this.getData();
    this.searchQuery.valueChanges.subscribe(query => this.filterData(query));
  }

  getData(): void {
    this.planeacionProduccionService.apiPlaneacionProduccionGet()
      .subscribe(response => {
        this.currentPage = 1;
        this.productionPlanifications = response.datos ?? [];
        this.filteredData = this.productionPlanifications;
        this.itemCount = this.filteredData.length;
        this.totalPages = Math.ceil(this.itemCount / this.itemsPerPage);
        this.updatePagination();
        this.updatePaginatedData();
      });
  }

  filterData(query: string): void {
    if (query.trim() === '') {
      this.filteredData = this.productionPlanifications;
    } else {
      this.filteredData = this.productionPlanifications.filter(productionPlanification =>
        productionPlanification.nombreProducto?.toLowerCase().includes(query.toLowerCase()) ||
        productionPlanification.nombreFamilia?.toLowerCase().includes(query.toLowerCase())
      );
      this.currentPage = 1;
    }
    this.itemCount = this.filteredData.length;
    this.totalPages = Math.ceil(this.itemCount / this.itemsPerPage);
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
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.productionPlanifications);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Roles');
    XLSX.writeFile(wb, 'familia_productos.xlsx');
  }

  openModal(modalContent: any): void {
    this.modalService.open(modalContent, { size: 'lg', backdrop: 'static', centered: true });
  }

  nextStep() {
    if (this.currentStep < 3) {
      this.currentStep++;
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  // Método para hacer clic en el input de archivo
  triggerFileUpload(): void {
    const fileInput = document.getElementById('upload-file') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  // Método para manejar cuando un archivo es seleccionado
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      this.fileName = input.files[0].name;
    }
  }

  // Método para manejar cuando se arrastra un archivo sobre el área
  onDrop(event: DragEvent): void {
    event.preventDefault();
    const fileInput = document.getElementById('upload-file') as HTMLInputElement;
    const files = event.dataTransfer?.files;

    if (files?.length) {
      fileInput.files = files;
      this.fileName = files[0].name;
    }

    const dragArea = document.getElementById('drag-drop-area');
    if (dragArea) {
      dragArea.classList.remove('active');
    }
  }

  // Método para manejar cuando el archivo ya no está siendo arrastrado sobre el área
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    const dragArea = document.getElementById('drag-drop-area');
    if (dragArea) {
      dragArea.classList.add('active');
    }
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    const dragArea = document.getElementById('drag-drop-area');
    if (dragArea) {
      dragArea.classList.remove('active');
    }
  }

  resetFile(): void {
    const fileInput = document.getElementById('upload-file') as HTMLInputElement;
    fileInput.value = '';
    this.fileName = '';
  }

  isUploading = false;          // Para controlar si estamos cargando
  uploadProgress = 0;           // Progreso de la carga
  selectedFileName: string | null = null; // Nombre del archivo seleccionado

  startUpload(event: any) {
    this.isUploading = true;  // Comenzamos la carga
      this.uploadProgress = 0;  // Reiniciamos el progreso

      // Simulamos una carga con intervalos
      const interval = setInterval(() => {
        this.uploadProgress += 10;
        if (this.uploadProgress >= 100) {
          clearInterval(interval);  // Detenemos el intervalo cuando llegue al 100%
          this.isUploading = false;  // Detenemos la simulación de carga
          this.uploadProgress = 100;
        }
      }, 500);  // Incrementamos el progreso cada 500ms
  }

}
