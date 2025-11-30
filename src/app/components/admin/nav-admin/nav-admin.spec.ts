import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { NavAdmin } from './nav-admin';

describe('NavAdmin', () => {
  let component: NavAdmin;
  let fixture: ComponentFixture<NavAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavAdmin, RouterTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavAdmin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
