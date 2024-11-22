import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IdleService } from './idle.service';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  isAdmin = true;
  nombres: any = '';
  apellidos: any = '';
  cargo: any = '';
  foto: any = '';

  constructor(private router: Router, private idleService: IdleService) {
    this.idleService.isIdle.subscribe(isIdle => {
      if (isIdle) {
        this.idleService.logout();
      }
    });
  }

  ngOnInit(): void {
    document.body.addEventListener('mousemove', () => {
      this.idleService.resetIdleTimer();
    });
    document.body.addEventListener('keydown', () => {
      this.idleService.resetIdleTimer();
    });

    setTimeout(() => {
      this.nombres = localStorage.getItem('nombres');
      this.apellidos = localStorage.getItem('apellidos');
      this.cargo = localStorage.getItem('cargo');
      this.foto = sessionStorage.getItem('foto-perfil');
      console.log("base64...", this.foto);
    }, 500);
  }

  logout() {
    this.router.navigate(['/login']);
  }

  userHasAccess(menu: string): boolean {
    if (menu === 'administracion' && !this.isAdmin) {
      return false;
    }
    return true;
  }

  openMenuDropdown(dropdownMenuElement: HTMLElement): void {
    const drowpDown = new bootstrap.Dropdown(dropdownMenuElement);
    drowpDown.toggle();
  }
}
