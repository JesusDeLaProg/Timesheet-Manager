import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { TimesheetListTableComponent } from "./timesheet-list-table.component";

describe("TimesheetListTableComponent", () => {
  let component: TimesheetListTableComponent;
  let fixture: ComponentFixture<TimesheetListTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TimesheetListTableComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimesheetListTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
