import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuajoutComponent } from './menuajout.component';

describe('MenuajoutComponent', () => {
  let component: MenuajoutComponent;
  let fixture: ComponentFixture<MenuajoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuajoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuajoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
