import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const tempAuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  const tempToken = route.queryParams['token'];
  const isSettingPassword = !!tempToken;

  const canActivate = isSettingPassword;
  if (!canActivate) {
    router.navigate(['/login']);
  }

return canActivate;
};
