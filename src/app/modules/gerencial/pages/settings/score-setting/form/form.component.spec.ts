import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { ScoreSettingsService } from '../score-settings.service';
import { FormComponent } from './form.component';

describe('FormComponent', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;

  const scoreSettingsServiceMock = {
    updateScoreConfiguration: jasmine.createSpy('updateScoreConfiguration').and.returnValue(of({ message: 'ok' })),
  } as Partial<ScoreSettingsService>;

  const toastrMock = {
    success: jasmine.createSpy('success'),
    error: jasmine.createSpy('error'),
  } as Partial<ToastrService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormComponent],
      providers: [
        { provide: ScoreSettingsService, useValue: scoreSettingsServiceMock },
        { provide: ToastrService, useValue: toastrMock },
      ],
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
