import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BannerDetailsStepComponent } from './banner-details-step.component';

describe('BannerDetailsStepComponent', () => {
  let component: BannerDetailsStepComponent;
  let fixture: ComponentFixture<BannerDetailsStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BannerDetailsStepComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BannerDetailsStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
