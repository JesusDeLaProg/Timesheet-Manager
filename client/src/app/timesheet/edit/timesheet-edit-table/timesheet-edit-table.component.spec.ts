import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimesheetEditTableComponent } from './timesheet-edit-table.component';

describe('TimesheetEditTableComponent', () => {
  let component: TimesheetEditTableComponent;
  let fixture: ComponentFixture<TimesheetEditTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TimesheetEditTableComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimesheetEditTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
