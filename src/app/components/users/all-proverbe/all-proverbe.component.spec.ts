<<<<<<< HEAD
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllProverbeComponent } from './all-proverbe.component';

describe('AllProverbeComponent', () => {
  let component: AllProverbeComponent;
  let fixture: ComponentFixture<AllProverbeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllProverbeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllProverbeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
=======
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllProverbeComponent } from './all-proverbe.component';

describe('AllProverbeComponent', () => {
  let component: AllProverbeComponent;
  let fixture: ComponentFixture<AllProverbeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllProverbeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllProverbeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
>>>>>>> afe05af085bf6474cb15d6eaf7a64896e5a8f91a
