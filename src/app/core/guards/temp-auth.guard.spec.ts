import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { tempAuthGuard } from './temp-auth.guard';

describe('tempAuthGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => tempAuthGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
