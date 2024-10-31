import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-product-family-admin',
  templateUrl: './product-family-admin.component.html',
  styleUrls: ['./product-family-admin.component.css']
})
export class ProductFamilyAdminComponent implements OnInit {

  productCount = 0;

  currentPage = 1;
  totalPages = 5;
  pages = Array(this.totalPages).fill(0);

  products = [
    {
      id: 1,
      code: 'PF1',
      description: 'Esta es la descripción de la familia del producto',
      status: 'Activo',
      creationDate: new Date('2023-07-06'),
    },
    {
      id: 2,
      code: 'PF2',
      description: 'Esta es la descripción de la familia del producto',
      status: 'Activo',
      creationDate: new Date('2023-07-06'),
    },
    {
      id: 3,
      code: 'PF3',
      description: 'Esta es la descripción de la familia del producto',
      status: 'Activo',
      creationDate: new Date('2023-07-06'),
    },
    {
      id: 4,
      code: 'PF4',
      description: 'Esta es la descripción de la familia del producto',
      status: 'Activo',
      creationDate: new Date('2023-07-06'),
    },
    {
      id: 5,
      code: 'PF5',
      description: 'Esta es la descripción de la familia del producto',
      status: 'Inactivo',
      creationDate: new Date('2023-07-06'),
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
