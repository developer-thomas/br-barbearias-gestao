import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { BannersService } from '../../../banners.service';
import { ToastrService } from 'ngx-toastr';
import { BannerDetailsStepComponent } from './banner-details-step.component';

describe('BannerDetailsStepComponent', () => {
  let component: BannerDetailsStepComponent;
  let fixture: ComponentFixture<BannerDetailsStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BannerDetailsStepComponent],
      providers: [
        {
          provide: BannersService,
          useValue: {
            getRegions: () => of([]),
          },
        },
        {
          provide: ToastrService,
          useValue: {
            error: jasmine.createSpy('error'),
          },
        },
      ],
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
