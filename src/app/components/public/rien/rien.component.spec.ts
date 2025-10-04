import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RienComponent } from './rien.component';

describe('RienComponent', () => {
  let component: RienComponent;
  let fixture: ComponentFixture<RienComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RienComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RienComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
