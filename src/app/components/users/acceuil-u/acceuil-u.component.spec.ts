<<<<<<< HEAD
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceuilUComponent } from './acceuil-u.component';

describe('AcceuilUComponent', () => {
  let component: AcceuilUComponent;
  let fixture: ComponentFixture<AcceuilUComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcceuilUComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcceuilUComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
=======
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceuilUComponent } from './acceuil-u.component';

describe('AcceuilUComponent', () => {
  let component: AcceuilUComponent;
  let fixture: ComponentFixture<AcceuilUComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcceuilUComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcceuilUComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
>>>>>>> afe05af085bf6474cb15d6eaf7a64896e5a8f91a
