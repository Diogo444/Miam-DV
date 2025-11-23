import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMenu } from './add-menu';

describe('AddMenu', () => {
  let component: AddMenu;
  let fixture: ComponentFixture<AddMenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddMenu]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddMenu);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
