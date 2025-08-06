import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultipleFilterTableComponent } from './multiple-filter-table.component';

describe('MultipleFilterTableComponent', () => {
  let component: MultipleFilterTableComponent;
  let fixture: ComponentFixture<MultipleFilterTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MultipleFilterTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MultipleFilterTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
