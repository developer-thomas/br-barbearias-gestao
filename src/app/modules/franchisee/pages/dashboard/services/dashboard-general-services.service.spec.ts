import { TestBed } from '@angular/core/testing';

import { DashboardGeneralServicesService } from './dashboard-general-services.service';

describe('DashboardGeneralServicesService', () => {
  let service: DashboardGeneralServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DashboardGeneralServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
