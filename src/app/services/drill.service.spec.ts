import { TestBed } from '@angular/core/testing';

import { DrillService } from './drill.service';

describe('DrillService', () => {
  let service: DrillService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DrillService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
