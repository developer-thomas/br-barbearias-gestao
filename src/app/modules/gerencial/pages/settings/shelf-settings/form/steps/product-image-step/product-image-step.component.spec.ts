import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductImageStepComponent } from './product-image-step.component';

describe('ProductImageStepComponent', () => {
  let component: ProductImageStepComponent;
  let fixture: ComponentFixture<ProductImageStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductImageStepComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProductImageStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
