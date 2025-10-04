import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { onlineOnlyGuard } from './online-only.guard';

describe('onlineOnlyGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => onlineOnlyGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
