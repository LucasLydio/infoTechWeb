import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsCoverCarouselComponent } from './news-cover-carousel.component';

describe('NewsCoverCarouselComponent', () => {
  let component: NewsCoverCarouselComponent;
  let fixture: ComponentFixture<NewsCoverCarouselComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewsCoverCarouselComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewsCoverCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
