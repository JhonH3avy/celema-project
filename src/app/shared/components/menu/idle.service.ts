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
  public isIdle = new BehaviorSubject<boolean>(false);  // Si el usuario está inactivo

  constructor(private router: Router) {
    this.resetIdleTimer();
  }

  // Método para resetear el temporizador de inactividad
  resetIdleTimer() {
    this.idleTime = 0;
    this.isIdle.next(false);
    clearTimeout(this.idleTimeout);
    clearTimeout(this.warningTimeout);

    // Resetear después de 5 minutos de inactividad
    this.idleTimeout = setTimeout(() => {
      this.isIdle.next(true);  // Indicamos que el usuario está inactivo
    }, 300000);  // 5 minutos (300000ms)

    // Mostrar modal de advertencia después de 2 minutos
    this.warningTimeout = setTimeout(() => {
      this.showInactivityModal();
    }, 120000);  // 2 minutos (120000ms)
  }

  // Mostrar el modal para confirmar si el usuario sigue activo
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
        // Si el usuario acepta, resetear la inactividad
        this.resetIdleTimer();
      } else {
        // Si el usuario decide cerrar sesión, cerrar sesión automáticamente
        this.logout();
      }
    });
  }

  // Método para cerrar sesión automáticamente
  logout() {
    clearTimeout(this.idleTimeout);
    clearTimeout(this.warningTimeout);
    this.router.navigate(['/login']);  // Redirigir a la página de login
  }
}
