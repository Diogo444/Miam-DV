<<<<<<< HEAD
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarComponentU } from './navbar.component';

describe('NavbarComponent', () => {
  let component: NavbarComponentU;
  let fixture: ComponentFixture<NavbarComponentU>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarComponentU]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbarComponentU);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
=======
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarComponentU } from './navbar.component';

describe('NavbarComponent', () => {
  let component: NavbarComponentU;
  let fixture: ComponentFixture<NavbarComponentU>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarComponentU]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbarComponentU);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
>>>>>>> afe05af085bf6474cb15d6eaf7a64896e5a8f91a
