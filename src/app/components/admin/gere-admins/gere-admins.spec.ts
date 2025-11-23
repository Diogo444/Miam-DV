import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GereAdmins } from './gere-admins';

describe('GereAdmins', () => {
  let component: GereAdmins;
  let fixture: ComponentFixture<GereAdmins>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GereAdmins]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GereAdmins);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
