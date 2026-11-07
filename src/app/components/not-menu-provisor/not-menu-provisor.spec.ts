import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotMenuProvisor } from './not-menu-provisor';

describe('NotMenuProvisor', () => {
  let component: NotMenuProvisor;
  let fixture: ComponentFixture<NotMenuProvisor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotMenuProvisor]
    })
      .compileComponents();

    fixture = TestBed.createComponent(NotMenuProvisor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
