import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { BannersService } from '../banners.service';
import { DetailsComponent } from './details.component';

describe('DetailsComponent', () => {
  let component: DetailsComponent;
  let fixture: ComponentFixture<DetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailsComponent],
      providers: [
        {
          provide: BannersService,
          useValue: {
            getBannerDetails: () => of({
              id: 1,
              title: 'Banner Teste',
              target: 'BRANCH',
              link: 'https://example.com',
              fileUrl: 'https://example.com/banner.png',
              fileKey: 'banner.png',
              startDate: '2025-01-01T00:00:00.000Z',
              endDate: '2025-12-31T23:59:59.000Z',
              status: 'ACTIVE',
              regions: ['São Paulo, São Paulo'],
            }),
            deleteBanner: jasmine.createSpy('deleteBanner').and.returnValue(of({ message: 'ok' })),
          },
        },
        {
          provide: ToastrService,
          useValue: {
            error: jasmine.createSpy('error'),
            success: jasmine.createSpy('success'),
          },
        },
        {
          provide: Router,
          useValue: {
            navigate: jasmine.createSpy('navigate'),
          },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => '1',
              },
            },
          },
        },
      ],
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
