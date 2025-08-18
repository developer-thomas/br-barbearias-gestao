import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BannerImageStepComponent } from './banner-image-step.component';

describe('BannerImageStepComponent', () => {
  let component: BannerImageStepComponent;
  let fixture: ComponentFixture<BannerImageStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BannerImageStepComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BannerImageStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
