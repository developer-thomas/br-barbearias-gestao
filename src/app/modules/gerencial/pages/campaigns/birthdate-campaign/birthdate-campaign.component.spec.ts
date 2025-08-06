import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BirthdateCampaignComponent } from './birthdate-campaign.component';

describe('BirthdateCampaignComponent', () => {
  let component: BirthdateCampaignComponent;
  let fixture: ComponentFixture<BirthdateCampaignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BirthdateCampaignComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BirthdateCampaignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
