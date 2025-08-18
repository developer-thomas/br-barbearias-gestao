import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDetailsStepComponent } from './product-details-step.component';

describe('ProductDetailsStepComponent', () => {
  let component: ProductDetailsStepComponent;
  let fixture: ComponentFixture<ProductDetailsStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductDetailsStepComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProductDetailsStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
