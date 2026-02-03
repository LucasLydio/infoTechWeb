import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviconTickerComponent } from './devicon-ticker.component';

describe('DeviconTickerComponent', () => {
  let component: DeviconTickerComponent;
  let fixture: ComponentFixture<DeviconTickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeviconTickerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeviconTickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
