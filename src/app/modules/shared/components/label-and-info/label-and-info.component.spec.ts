import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabelAndInfoComponent } from './label-and-info.component';

describe('LabelAndInfoComponent', () => {
  let component: LabelAndInfoComponent;
  let fixture: ComponentFixture<LabelAndInfoComponent>;

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      imports: [LabelAndInfoComponent],
    })
    .compileComponents();

    fixture = TestBed.createComponent(LabelAndInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
