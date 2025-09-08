import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FranchiseReportComponent } from './franchise-report.component';

describe('FranchiseReportComponent', () => {
  let component: FranchiseReportComponent;
  let fixture: ComponentFixture<FranchiseReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FranchiseReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FranchiseReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
