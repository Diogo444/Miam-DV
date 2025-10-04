import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProverbeajoutComponent } from './proverbeajout.component';

describe('ProverbeajoutComponent', () => {
  let component: ProverbeajoutComponent;
  let fixture: ComponentFixture<ProverbeajoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProverbeajoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProverbeajoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
