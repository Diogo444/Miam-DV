<<<<<<< HEAD
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { AuthService } from '../../services/auth/auth.service';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let routerSpy = { navigate: jasmine.createSpy('navigate') } as any;
  let authServiceSpy = {
    getRole: jasmine.createSpy('getRole').and.returnValue('admin'),
  } as any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthGuard, { provide: Router, useValue: routerSpy }, { provide: AuthService, useValue: authServiceSpy }],
    });
    guard = TestBed.inject(AuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
=======
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { AuthService } from '../../services/auth/auth.service';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let routerSpy = { navigate: jasmine.createSpy('navigate') } as any;
  let authServiceSpy = {
    getRole: jasmine.createSpy('getRole').and.returnValue('admin'),
  } as any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthGuard, { provide: Router, useValue: routerSpy }, { provide: AuthService, useValue: authServiceSpy }],
    });
    guard = TestBed.inject(AuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
>>>>>>> afe05af085bf6474cb15d6eaf7a64896e5a8f91a
