import { TestBed } from '@angular/core/testing';

import { PalmService } from './palm.service';

describe('PalmService', () => {
  let service: PalmService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PalmService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
