import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-equipment-restriction',
  templateUrl: './equipment-restriction.component.html',
  styleUrls: ['./equipment-restriction.component.css']
})
export class EquipmentRestrictionComponent implements OnInit {

  FormGroup: FormGroup;

  currentPage = 1;
  totalPages = 5;
  pages = Array(this.totalPages).fill(0);

  equipmentRestrictions = [
    {
      id: 1,
      code: 'PRDCT1',
      description: 'Esta es la descripción del equipo',
      status: 'Activo',
      creationDate: new Date('2023-07-06'),
      type: 'PT1',
      meassurementUnit: 'Lts',
      value: '3',
      priority: 'Alta',
      familia: 'Familia',
      equipo: 'Equipo E2#1',
    },
    {
      id: 2,
      code: 'PRDCT2',
      description: 'Esta es la descripción del equipo',
      status: 'Activo',
      creationDate: new Date('2023-07-06'),
      type: 'PT1',
      meassurementUnit: 'Lts',
      value: '3',
      priority: 'Media',
      familia: 'Familia',
      equipo: 'Equipo E2#1',
    },
    {
      id: 3,
      code: 'PRDCT3',
      description: 'Esta es la descripción del equipo',
      status: 'Activo',
      creationDate: new Date('2023-07-06'),
      type: 'PT2',
      meassurementUnit: 'Lts',
      value: '3',
      priority: 'Baja',
      familia: 'Familia',
      equipo: 'Equipo E2#1',
    },
    {
      id: 4,
      code: 'PRDCT4',
      description: 'Esta es la descripción del equipo',
      status: 'Activo',
      creationDate: new Date('2023-07-06'),
      type: 'PT2',
      meassurementUnit: 'Lts',
      value: '3',
      priority: 'Media',
      familia: 'Familia',
      equipo: 'Equipo E2#1',
    },
    {
      id: 5,
      code: 'PRDCT5',
      description: 'Esta es la descripción del equipo',
      status: 'Inactivo',
      creationDate: new Date('2023-07-06'),
      type: 'PT3',
      meassurementUnit: 'Lts',
      value: '3',
      priority: 'Alta',
      familia: 'Familia',
      equipo: 'Equipo E2#1',
    },
  ];

  washRestrictions = [
    {
      id: 1,
      restriction: 'Restricción 1',
      type: 'Tipo 1'
    },
    {
      id: 2,
      restriction: 'Restricción 2',
      type: 'Tipo 2'
    },
    {
      id: 3,
      restriction: 'Restricción 3',
      type: 'Tipo 3'
    },
    {
      id: 4,
      restriction: 'Restricción 4',
      type: 'Tipo 4'
    },
    {
      id: 5,
      restriction: 'Restricción 5',
      type: 'Tipo 5'
    },
  ];

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
