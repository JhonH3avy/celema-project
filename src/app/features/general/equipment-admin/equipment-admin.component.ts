import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-equipment-admin',
  templateUrl: './equipment-admin.component.html',
  styleUrls: ['./equipment-admin.component.css']
})
export class EquipmentAdminComponent implements OnInit {

  equimentCount = 0;

  currentPage = 1;
  totalPages = 5;
  pages = Array(this.totalPages).fill(0);

  equipments = [
    {
      id: 1,
      code: 'PF1',
      type: 'TP1',
      description: 'Esta es la descripción de la familia del producto',
      status: 'Activo',
      creationDate: new Date('2023-07-06'),
      location: 'ZN1',
    },
    {
      id: 2,
      code: 'PF2',
      type: 'TP2',
      description: 'Esta es la descripción de la familia del producto',
      status: 'Activo',
      creationDate: new Date('2023-07-06'),
      location: 'ZN2',
    },
    {
      id: 3,
      code: 'PF3',
      type: 'TP1',
      description: 'Esta es la descripción de la familia del producto',
      status: 'Activo',
      creationDate: new Date('2023-07-06'),
      location: 'ZN1',
    },
    {
      id: 4,
      code: 'PF4',
      type: 'TP1',
      description: 'Esta es la descripción de la familia del producto',
      status: 'Activo',
      creationDate: new Date('2023-07-06'),
      location: 'ZN1',
    },
    {
      id: 5,
      code: 'PF5',
      type: 'TP3',
      description: 'Esta es la descripción de la familia del producto',
      status: 'Inactivo',
      creationDate: new Date('2023-07-06'),
      location: 'ZN2',
    },
  ];

  equipmentRestrictions = [
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

  constructor() { }

  ngOnInit(): void {
    this.equimentCount = this.equipments.length;
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
}
