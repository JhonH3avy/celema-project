import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IdleService } from './idle.service';

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

  constructor(private router: Router, private idleService: IdleService) {
    // Escuchar los cambios en el estado de inactividad
    this.idleService.isIdle.subscribe(isIdle => {
      if (isIdle) {
        this.idleService.logout();  // Cerrar sesión automáticamente después de 5 minutos
      }
    });
  }

  ngOnInit(): void {
    // Resetear el temporizador cada vez que el usuario interactúe
    document.body.addEventListener('mousemove', () => {
      this.idleService.resetIdleTimer();
    });
    document.body.addEventListener('keydown', () => {
      this.idleService.resetIdleTimer();
    });

    // se cargan los datos del usuario
    this.nombres = localStorage.getItem('nombres');
    this.apellidos = localStorage.getItem('apellidos');
    this.cargo = localStorage.getItem('cargo');
  }

  // Método para cerrar sesión
  logout() {
    this.router.navigate(['/login']);
  }

  // Método para verificar los permisos del usuario y ocultar el menú
  userHasAccess(menu: string): boolean {
    // Aquí puedes añadir la lógica para verificar si el usuario tiene acceso a este menú
    if (menu === 'administracion' && !this.isAdmin) {
      return false;  // Si el usuario no es admin, no tiene acceso
    }
    return true;
  }
}
