<<<<<<< HEAD
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiammiajoutComponent } from './miammi.component';

describe('MiammiComponent', () => {
  let component: MiammiajoutComponent;
  let fixture: ComponentFixture<MiammiajoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MiammiajoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MiammiajoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
=======
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiammiajoutComponent } from './miammi.component';

describe('MiammiComponent', () => {
  let component: MiammiajoutComponent;
  let fixture: ComponentFixture<MiammiajoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MiammiajoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MiammiajoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
>>>>>>> afe05af085bf6474cb15d6eaf7a64896e5a8f91a
