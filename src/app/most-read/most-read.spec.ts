import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MostRead } from './most-read';

describe('MostRead', () => {
  let component: MostRead;
  let fixture: ComponentFixture<MostRead>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MostRead],
    }).compileComponents();

    fixture = TestBed.createComponent(MostRead);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
