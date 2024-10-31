import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-equipment-restriction',
  templateUrl: './equipment-restriction.component.html',
  styleUrls: ['./equipment-restriction.component.css']
})
export class EquipmentRestrictionComponent implements OnInit {

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
    },
  ]

  constructor() { }

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

}
