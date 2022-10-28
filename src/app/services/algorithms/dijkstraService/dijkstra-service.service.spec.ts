import { TestBed } from '@angular/core/testing';

import { DijkstraServiceService } from './dijkstra-service.service';

describe('DijkstraServiceService', () => {
  let service: DijkstraServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DijkstraServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
