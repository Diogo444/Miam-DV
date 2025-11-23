import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavPublic } from './nav-public';

describe('NavPublic', () => {
  let component: NavPublic;
  let fixture: ComponentFixture<NavPublic>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavPublic]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavPublic);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
