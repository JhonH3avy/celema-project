import { TestBed } from '@angular/core/testing';

import { PrioritizationService } from './prioritization.service';

describe('PrioritizationServiceService', () => {
  let service: PrioritizationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrioritizationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
