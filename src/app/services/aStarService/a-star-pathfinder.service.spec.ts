import { TestBed } from '@angular/core/testing';

import { AStarPathfinderService } from './a-star-pathfinder.service';

describe('AStarPathfinderService', () => {
  let service: AStarPathfinderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AStarPathfinderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
