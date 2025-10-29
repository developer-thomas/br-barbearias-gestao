import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import { ListComponent } from './list.component';
import { RankingService } from '../ranking.service';

describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;

  beforeEach(async () => {
    const rankingServiceMock = {
      getRanking: jasmine.createSpy('getRanking').and.returnValue(of([])),
    };

    const toastrServiceMock = {
      success: jasmine.createSpy('success'),
      error: jasmine.createSpy('error'),
    };

    await TestBed.configureTestingModule({
      imports: [ListComponent, HttpClientTestingModule],
      providers: [
        { provide: RankingService, useValue: rankingServiceMock },
        { provide: ToastrService, useValue: toastrServiceMock },
      ],
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
