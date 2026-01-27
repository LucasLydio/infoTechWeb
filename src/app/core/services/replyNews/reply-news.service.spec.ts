import { TestBed } from '@angular/core/testing';

import { ReplyNewsService } from './reply-news.service';

describe('ReplyNewsService', () => {
  let service: ReplyNewsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReplyNewsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
