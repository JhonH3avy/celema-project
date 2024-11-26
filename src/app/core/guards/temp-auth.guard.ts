import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const tempAuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  const token = localStorage.getItem('authToken');
  const isAuthenticated = !!token;

  const tempToken = route.queryParams['token'];
  const isSettingPassword = !!tempToken;

  const profileRegex = /profile/i;
  const isActivatingProfile = route.url.some(segment => profileRegex.test(segment.path));

  const canActivate = isAuthenticated || (isSettingPassword && isActivatingProfile);
  if (!canActivate) {
    router.navigate(['/login']);
  }

return canActivate;
};
