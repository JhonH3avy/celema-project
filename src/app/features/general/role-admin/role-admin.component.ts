import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-role-admin',
  templateUrl: './role-admin.component.html',
  styleUrls: ['./role-admin.component.css']
})
export class RoleAdminComponent implements OnInit {

  userCount = 0;

  currentPage = 1;
  totalPages = 5;
  pages = Array(this.totalPages).fill(0);

  roles = [
    {
      id: 1,
      name: 'Administrador',
      description: 'Esta es la descripción del rol',
      status: 'Activo',
      creationDate: new Date('2023-07-06'),
    },
    {
      id: 2,
      name: 'Lector',
      description: 'Esta es la descripción del rol',
      status: 'Activo',
      creationDate: new Date('2023-07-06'),
    },
    {
      id: 3,
      name: 'Editor de plan',
      description: 'Esta es la descripción del rol',
      status: 'Activo',
      creationDate: new Date('2023-07-06'),
    },
    {
      id: 4,
      name: 'Creador',
      description: 'Esta es la descripción del rol',
      status: 'Activo',
      creationDate: new Date('2023-07-06'),
    },
    {
      id: 1,
      name: 'Temporal',
      description: 'Esta es la descripción del rol',
      status: 'Inactivo',
      creationDate: new Date('2023-07-06'),
    },
  ]

  constructor() { }

  ngOnInit(): void {
    this.userCount = this.roles.length;
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
