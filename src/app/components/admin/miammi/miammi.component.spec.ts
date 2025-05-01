import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiammiComponent } from './miammi.component';

describe('MiammiComponent', () => {
  let component: MiammiComponent;
  let fixture: ComponentFixture<MiammiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MiammiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MiammiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
