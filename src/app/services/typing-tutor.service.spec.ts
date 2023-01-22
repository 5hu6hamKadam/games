import { TestBed } from '@angular/core/testing';

import { TypingTutorService } from './typing-tutor.service';

describe('TypingTutorService', () => {
  let service: TypingTutorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TypingTutorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
