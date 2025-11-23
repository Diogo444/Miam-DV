<<<<<<< HEAD
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlatComponent } from './plat.component';

describe('PlatComponent', () => {
  let component: PlatComponent;
  let fixture: ComponentFixture<PlatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlatComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
=======
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlatComponent } from './plat.component';

describe('PlatComponent', () => {
  let component: PlatComponent;
  let fixture: ComponentFixture<PlatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlatComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
>>>>>>> afe05af085bf6474cb15d6eaf7a64896e5a8f91a
