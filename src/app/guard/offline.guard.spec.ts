<<<<<<< HEAD
import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { offlineGuard } from './offline.guard';

describe('offlineGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => offlineGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
=======
import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { offlineGuard } from './offline.guard';

describe('offlineGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => offlineGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
>>>>>>> afe05af085bf6474cb15d6eaf7a64896e5a8f91a
