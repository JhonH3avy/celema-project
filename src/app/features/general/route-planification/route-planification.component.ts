import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-route-planification',
  templateUrl: './route-planification.component.html',
  styleUrls: ['./route-planification.component.css']
})
export class RoutePlanificationComponent implements OnInit {

  currentPage = 1;
  totalPages = 5;
  pages = Array(this.totalPages).fill(0);

  washRestrictions = [
    {
      id: 1,
      code: 'PRDCT1',
      description: 'Esta es la descripción del equipo',
      status: 'OK',
      requestDate: new Date('2023-07-06'),
      equipmentList: ['EC1', 'EC4', 'EC2'],
      restrictionList: ['RC1', 'RC5'],
      routeUsage: '10',
    },
    {
      id: 2,
      code: 'PRDCT2',
      description: 'Esta es la descripción del equipo',
      status: 'OK',
      requestDate: new Date('2023-07-06'),
      equipmentList: ['EC1'],
      restrictionList: ['RC1', 'RC2', 'RC3'],
      routeUsage: '2',
    },
    {
      id: 3,
      code: 'PRDCT3',
      description: 'Esta es la descripción del equipo',
      status: 'OK',
      requestDate: new Date('2023-07-06'),
      equipmentList: ['EC3', 'EC4'],
      restrictionList: ['RC2', 'RC8', 'RC10'],
      routeUsage: '5',
    },
    {
      id: 4,
      code: 'PRDCT4',
      description: 'Esta es la descripción del equipo',
      status: 'OK',
      requestDate: new Date('2023-07-06'),
      equipmentList: ['EC1'],
      restrictionList: ['RC1'],
      routeUsage: '9',
    },
    {
      id: 5,
      code: 'PRDCT5',
      description: 'Esta es la descripción del equipo',
      status: 'OFF',
      requestDate: new Date('2023-07-06'),
      equipmentList: ['EC1', 'EC2', 'EC3'],
      restrictionList: ['RC1', 'RC2', 'RC3'],
      routeUsage: '8',
    },
  ]

  constructor() { }

  ngOnInit(): void {
  }

  getStatusStyle(status: string): string[] {
    switch (status) {
      case 'OK': return ['border-success', 'text-success', 'bg-success-subtle'];
      case 'OFF': return ['border-danger', ' text-danger', 'bg-danger-subtle'];
      default: return [];
    }
  }

  changePage(pageToLoad: number): void {
    this.currentPage = pageToLoad;
  }
}
