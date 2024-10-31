import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-demand-planification',
  templateUrl: './demand-planification.component.html',
  styleUrls: ['./demand-planification.component.css']
})
export class DemandPlanificationComponent implements OnInit {

  currentPage = 1;
  totalPages = 5;
  pages = Array(this.totalPages).fill(0);

  productDemands = [
    {
      id: 1,
      code: 'PRDCT1',
      description: 'Esta es la descripción del producto',
      unitsToProduce: 100,
      week: 32,
      requestDate: new Date('2023-07-06'),
    },
    {
      id: 2,
      code: 'PRDCT2',
      description: 'Esta es la descripción del producto',
      unitsToProduce: 100,
      week: 32,
      requestDate: new Date('2023-07-06'),
    },
    {
      id: 3,
      code: 'PRDCT3',
      description: 'Esta es la descripción del producto',
      unitsToProduce: 100,
      week: 32,
      requestDate: new Date('2023-07-06'),
    },
    {
      id: 4,
      code: 'PRDCT4',
      description: 'Esta es la descripción del producto',
      unitsToProduce: 100,
      week: 32,
      requestDate: new Date('2023-07-06'),
    },
    {
      id: 5,
      code: 'PRDCT5',
      description: 'Esta es la descripción del producto',
      unitsToProduce: 100,
      week: 32,
      requestDate: new Date('2023-07-06'),
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
