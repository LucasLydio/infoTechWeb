import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { canLoadGuard } from './can-load.guard';

describe('canLoadGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => canLoadGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
