<<<<<<< HEAD
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsernameComponent } from './username.component';

describe('UsernameComponent', () => {
  let component: UsernameComponent;
  let fixture: ComponentFixture<UsernameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsernameComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsernameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
=======
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsernameComponent } from './username.component';

describe('UsernameComponent', () => {
  let component: UsernameComponent;
  let fixture: ComponentFixture<UsernameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsernameComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsernameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
>>>>>>> afe05af085bf6474cb15d6eaf7a64896e5a8f91a
