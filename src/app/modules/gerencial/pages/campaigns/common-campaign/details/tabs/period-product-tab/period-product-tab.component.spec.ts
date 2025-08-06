import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeriodProductTabComponent } from './period-product-tab.component';

describe('PeriodProductTabComponent', () => {
  let component: PeriodProductTabComponent;
  let fixture: ComponentFixture<PeriodProductTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PeriodProductTabComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PeriodProductTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
