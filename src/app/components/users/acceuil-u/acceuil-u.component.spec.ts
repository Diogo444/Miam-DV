import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceuilUComponent } from './acceuil-u.component';

describe('AcceuilUComponent', () => {
  let component: AcceuilUComponent;
  let fixture: ComponentFixture<AcceuilUComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcceuilUComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcceuilUComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
