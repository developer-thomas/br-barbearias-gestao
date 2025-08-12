import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AudienceLocationTabComponent } from './audience-location-tab.component';

describe('AudienceLocationTabComponent', () => {
  let component: AudienceLocationTabComponent;
  let fixture: ComponentFixture<AudienceLocationTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AudienceLocationTabComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AudienceLocationTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
