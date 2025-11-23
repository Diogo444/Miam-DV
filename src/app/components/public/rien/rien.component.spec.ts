<<<<<<< HEAD
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RienComponent } from './rien.component';

describe('RienComponent', () => {
  let component: RienComponent;
  let fixture: ComponentFixture<RienComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RienComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RienComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
=======
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RienComponent } from './rien.component';

describe('RienComponent', () => {
  let component: RienComponent;
  let fixture: ComponentFixture<RienComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RienComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RienComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
>>>>>>> afe05af085bf6474cb15d6eaf7a64896e5a8f91a
