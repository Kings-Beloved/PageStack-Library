import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PreOrder } from './pre-order';

describe('PreOrder', () => {
  let component: PreOrder;
  let fixture: ComponentFixture<PreOrder>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreOrder],
    }).compileComponents();

    fixture = TestBed.createComponent(PreOrder);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
