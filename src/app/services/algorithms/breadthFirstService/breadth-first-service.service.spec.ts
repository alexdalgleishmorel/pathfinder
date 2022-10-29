import { TestBed } from '@angular/core/testing';

import { BreadthFirstServiceService } from './breadth-first-service.service';

describe('BreadthFirstServiceService', () => {
  let service: BreadthFirstServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BreadthFirstServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
