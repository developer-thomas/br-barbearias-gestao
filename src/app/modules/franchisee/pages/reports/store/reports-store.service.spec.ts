import { TestBed } from '@angular/core/testing';

import { ReportsStoreService } from './reports-store.service';

describe('ReportsStoreService', () => {
  let service: ReportsStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReportsStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
