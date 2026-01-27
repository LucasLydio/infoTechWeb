import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsSideComponent } from './news-side.component';

describe('NewsSideComponent', () => {
  let component: NewsSideComponent;
  let fixture: ComponentFixture<NewsSideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewsSideComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewsSideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
