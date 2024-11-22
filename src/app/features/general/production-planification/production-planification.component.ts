import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-production-planification',
  templateUrl: './production-planification.component.html',
  styleUrl: './production-planification.component.css'
})
export class ProductionPlanificationComponent {
  FormGroup: FormGroup;
  productCount = 0;

  currentPage = 1;
  totalPages = 5;
  pages = Array(this.totalPages).fill(0);
  currentStep: number = 1;
  fileName: string = '';

  products = [
    {
      id: 1,
      code: 'PF1',
      description: 'Esta es la descripción de la familia del producto',
      unidades: '2000',
      semana: '32',
      creationDate: new Date('2023-07-06'),
      familia: 'Familia 1',
    },
    {
      id: 2,
      code: 'PF2',
      description: 'Esta es la descripción de la familia del producto',
      unidades: '2000',
      semana: '32',
      creationDate: new Date('2023-07-06'),
      familia: 'Familia 1',
    },
    {
      id: 3,
      code: 'PF3',
      description: 'Esta es la descripción de la familia del producto',
      unidades: '2000',
      semana: '32',
      creationDate: new Date('2023-07-06'),
      familia: 'Familia 1',
    },
    {
      id: 4,
      code: 'PF4',
      description: 'Esta es la descripción de la familia del producto',
      unidades: '2000',
      semana: '32',
      creationDate: new Date('2023-07-06'),
      familia: 'Familia 1',
    },
    {
      id: 5,
      code: 'PF5',
      description: 'Esta es la descripción de la familia del producto',
      unidades: '2000',
      semana: '32',
      creationDate: new Date('2023-07-06'),
      familia: 'Familia 1',
    },
  ]

  constructor(private modalService: NgbModal, private fb: FormBuilder) {
    this.FormGroup = this.fb.group({

    });
   }

  ngOnInit(): void {
    this.productCount = this.products.length;
  }

  getStatusStyle(status: string): string[] {
    switch (status) {
      case 'Activo': return ['border-success', 'text-success', 'bg-success-subtle'];
      case 'Inactivo': return ['border-danger', ' text-danger', 'bg-danger-subtle'];
      default: return [];
    }
  }

  changePage(pageToLoad: number): void {
    this.currentPage = pageToLoad;
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
