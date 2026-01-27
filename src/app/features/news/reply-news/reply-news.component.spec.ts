import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReplyNewsComponent } from './reply-news.component';

describe('ReplyNewsComponent', () => {
  let component: ReplyNewsComponent;
  let fixture: ComponentFixture<ReplyNewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReplyNewsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReplyNewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
