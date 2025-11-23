import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AfficherSuggestions } from './afficher-suggestions';

describe('AfficherSuggestions', () => {
  let component: AfficherSuggestions;
  let fixture: ComponentFixture<AfficherSuggestions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AfficherSuggestions]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AfficherSuggestions);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
