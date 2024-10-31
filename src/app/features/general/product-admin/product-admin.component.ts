import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-product-admin',
  templateUrl: './product-admin.component.html',
  styleUrls: ['./product-admin.component.css']
})
export class ProductAdminComponent implements OnInit {

  productCount = 0;

  currentPage = 1;
  totalPages = 5;
  pages = Array(this.totalPages).fill(0);

  products = [
    {
      id: 1,
      code: 'PRDCT1',
      description: 'Esta es la descripción del producto',
      status: 'Activo',
      creationDate: new Date('2023-07-06'),
      volume: '3 lts',
      presentation: 'Caja',
      family: 'Lácteos',
    },
    {
      id: 2,
      code: 'PRDCT2',
      description: 'Esta es la descripción del producto',
      status: 'Activo',
      creationDate: new Date('2023-07-06'),
      volume: '3 lts',
      presentation: 'Caja',
      family: 'Lácteos',
    },
    {
      id: 3,
      code: 'PRDCT3',
      description: 'Esta es la descripción del producto',
      status: 'Activo',
      creationDate: new Date('2023-07-06'),
      volume: '3 lts',
      presentation: 'Caja',
      family: 'Lácteos',
    },
    {
      id: 4,
      code: 'PRDCT4',
      description: 'Esta es la descripción del producto',
      status: 'Activo',
      creationDate: new Date('2023-07-06'),
      volume: '3 lts',
      presentation: 'Caja',
      family: 'Lácteos',
    },
    {
      id: 5,
      code: 'PRDCT5',
      description: 'Esta es la descripción del producto',
      status: 'Inactivo',
      creationDate: new Date('2023-07-06'),
      volume: '3 lts',
      presentation: 'Caja',
      family: 'Lácteos',
    },
  ]

  constructor() { }

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
}
