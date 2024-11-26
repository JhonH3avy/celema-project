import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  const token = localStorage.getItem('authToken');
  const isAuthenticated = !!token;

  if (!isAuthenticated) {
    router.navigate(['/login']);
  }

return isAuthenticated;
};
