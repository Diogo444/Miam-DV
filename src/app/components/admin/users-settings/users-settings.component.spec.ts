<<<<<<< HEAD
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersSettingsComponent } from './users-settings.component';

describe('UsersSettingsComponent', () => {
  let component: UsersSettingsComponent;
  let fixture: ComponentFixture<UsersSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersSettingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsersSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
=======
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersSettingsComponent } from './users-settings.component';

describe('UsersSettingsComponent', () => {
  let component: UsersSettingsComponent;
  let fixture: ComponentFixture<UsersSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersSettingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsersSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
>>>>>>> afe05af085bf6474cb15d6eaf7a64896e5a8f91a
