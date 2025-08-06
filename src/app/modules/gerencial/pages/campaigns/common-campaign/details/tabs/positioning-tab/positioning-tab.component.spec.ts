import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PositioningTabComponent } from './positioning-tab.component';

describe('PositioningTabComponent', () => {
  let component: PositioningTabComponent;
  let fixture: ComponentFixture<PositioningTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PositioningTabComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PositioningTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
