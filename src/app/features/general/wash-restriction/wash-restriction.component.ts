import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-wash-restriction',
  templateUrl: './wash-restriction.component.html',
  styleUrls: ['./wash-restriction.component.css']
})
export class WashRestrictionComponent implements OnInit {

  FormGroup: FormGroup;

  currentPage = 1;
  totalPages = 5;
  pages = Array(this.totalPages).fill(0);

  washRestrictions = [
    {
      id: 1,
      code: 'PRDCT1',
      description: 'Esta es la descripción del equipo',
      status: 'Activo',
      creationDate: new Date('2023-07-06'),
      type: 'PT1',
      frecuency: '3 días',
      time: '1 hora',
      priority: 'Alta',
    },
    {
      id: 2,
      code: 'PRDCT2',
      description: 'Esta es la descripción del equipo',
      status: 'Activo',
      creationDate: new Date('2023-07-06'),
      type: 'PT1',
      frecuency: '1 días',
      time: '2 hora',
      priority: 'Media',
    },
    {
      id: 3,
      code: 'PRDCT3',
      description: 'Esta es la descripción del equipo',
      status: 'Activo',
      creationDate: new Date('2023-07-06'),
      type: 'PT2',
      frecuency: '5 días',
      time: '30 minutos',
      priority: 'Baja',
    },
    {
      id: 4,
      code: 'PRDCT4',
      description: 'Esta es la descripción del equipo',
      status: 'Activo',
      creationDate: new Date('2023-07-06'),
      type: 'PT2',
      frecuency: '2 días',
      time: '1 hora',
      priority: 'Media',
    },
    {
      id: 5,
      code: 'PRDCT5',
      description: 'Esta es la descripción del equipo',
      status: 'Inactivo',
      creationDate: new Date('2023-07-06'),
      type: 'PT3',
      frecuency: '3 días',
      time: '2 hora',
      priority: 'Alta',
    },
  ]

  constructor(private modalService: NgbModal, private fb: FormBuilder) {
    this.FormGroup = this.fb.group({

    });
  }

  ngOnInit(): void {
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
}
