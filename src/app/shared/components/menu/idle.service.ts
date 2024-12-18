import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import Swal from 'sweetalert2';  // Importar SweetAlert2

@Injectable({
  providedIn: 'root'
})
export class IdleService {
  private idleTimeout: any;
  private warningTimeout: any;
  private idleTime = 0;
  public isIdle = new BehaviorSubject<boolean>(false);

  constructor(private router: Router) {
    this.resetIdleTimer();
  }

  resetIdleTimer() {
    this.idleTime = 0;
    this.isIdle.next(false);
    clearTimeout(this.idleTimeout);
    clearTimeout(this.warningTimeout);

    this.idleTimeout = setTimeout(() => {
      this.isIdle.next(true);
    }, 700000);

    this.warningTimeout = setTimeout(() => {
      this.showInactivityModal();
    }, 190000);
  }

  private showInactivityModal() {
    Swal.fire({
      title: '¿Sigues ahí?',
      text: 'Te has quedado inactivo por un tiempo. ¿Quieres seguir conectado?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, seguir conectado',
      cancelButtonText: 'No, cerrar sesión'
    }).then((result) => {
      if (result.isConfirmed) {
        this.resetIdleTimer();
      } else {
        this.logout();
      }
    });
  }

  logout() {
    clearTimeout(this.idleTimeout);
    clearTimeout(this.warningTimeout);
    localStorage.removeItem('authToken');
    localStorage.removeItem('nombres');
    localStorage.removeItem('apellidos');
    localStorage.removeItem('cargo');
    this.router.navigate(['/login']);
  }
}
