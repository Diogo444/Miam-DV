<<<<<<< HEAD
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarAComponent } from './navbar-a.component';

describe('NavbarAComponent', () => {
  let component: NavbarAComponent;
  let fixture: ComponentFixture<NavbarAComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarAComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbarAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
=======
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarAComponent } from './navbar-a.component';

describe('NavbarAComponent', () => {
  let component: NavbarAComponent;
  let fixture: ComponentFixture<NavbarAComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarAComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbarAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
>>>>>>> afe05af085bf6474cb15d6eaf7a64896e5a8f91a
