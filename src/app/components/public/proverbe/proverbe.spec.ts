import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Proverbe } from './proverbe';

describe('Proverbe', () => {
  let component: Proverbe;
  let fixture: ComponentFixture<Proverbe>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Proverbe]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Proverbe);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
