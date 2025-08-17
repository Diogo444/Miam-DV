import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiammiajoutComponent } from './miammi.component';

describe('MiammiComponent', () => {
  let component: MiammiajoutComponent;
  let fixture: ComponentFixture<MiammiajoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MiammiajoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MiammiajoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
