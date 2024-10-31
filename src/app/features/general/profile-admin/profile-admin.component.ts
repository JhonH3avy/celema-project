import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile-admin',
  templateUrl: './profile-admin.component.html',
  styleUrls: ['./profile-admin.component.css']
})
export class ProfileAdminComponent implements OnInit {

  userCount = 0;

  currentPage = 1;
  totalPages = 5;
  pages = Array(this.totalPages).fill(0);

  profiles = [
    {
      id: 1,
      username: 'Cristina Gomez',
      email: 'cristina.gomez@celema.com',
      profileImageSource: './assets/img/profile_image_placeholder.jpg', // This local path is just for testing purposes, this should be an online public url to load the image from the network
      access: [
        'Admin',
        'Lector',
        'Editor de plan',
      ],
      lastAccessDate: new Date('2023-12-08'),
      ingressDate: new Date('2023-07-06'),
    },
    {
      id: 2,
      username: 'Cristina Gomez',
      email: 'cristina.gomez@celema.com',
      profileImageSource: './assets/img/profile_image_placeholder.jpg',
      access: [
        'Admin',
        'Lector',
      ],
      lastAccessDate: new Date('2023-12-08'),
      ingressDate: new Date('2023-07-06'),
    },
    {
      id: 3,
      username: 'Cristina Gomez',
      email: 'cristina.gomez@celema.com',
      profileImageSource: './assets/img/profile_image_placeholder.jpg',
      access: [
        'Lector',
      ],
      lastAccessDate: new Date('2023-12-08'),
      ingressDate: new Date('2023-07-06'),
    },
    {
      id: 4,
      username: 'Cristina Gomez',
      email: 'cristina.gomez@celema.com',
      profileImageSource: './assets/img/profile_image_placeholder.jpg',
      access: [
        'Admin',
        'Editor de plan',
      ],
      lastAccessDate: new Date('2023-12-08'),
      ingressDate: new Date('2023-07-06'),
    }
  ];

  roles = [
    {
      id: 1,
      name: 'Administrador',
    },
    {
      id: 2,
      name: 'Lector',
    },
    {
      id: 3,
      name: 'Editor de plan',
    },
    {
      id: 4,
      name: 'Creador',
    },
    {
      id: 5,
      name: 'Temporal',
    },
  ]

  constructor() { }

  ngOnInit(): void {
    this.userCount = this.profiles.length;
  }

  getProfileAccessStyle(access: string): string[] {
    switch (access) {
      case 'Admin': return ['border-primary', 'text-primary', 'bg-primary-subtle'];
      case 'Editor de plan': return ['border-danger', ' text-danger', 'bg-danger-subtle'];
      case 'Lector': return ['border-success', 'text-success', 'bg-success-subtle'];
      default: return [];
    }
  }

  changePage(pageToLoad: number): void {
    this.currentPage = pageToLoad;
  }
}
