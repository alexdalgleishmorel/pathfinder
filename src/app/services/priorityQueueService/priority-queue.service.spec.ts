import { TestBed } from '@angular/core/testing';

import { PriorityQueueService } from './priority-queue.service';

describe('PriorityQueueService', () => {
  let service: PriorityQueueService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PriorityQueueService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
