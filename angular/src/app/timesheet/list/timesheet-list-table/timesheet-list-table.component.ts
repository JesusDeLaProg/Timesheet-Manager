import { Component, OnInit, Input } from '@angular/core';
import { IViewTimesheet } from '../../../../../../types/viewmodels';

@Component({
  selector: 'tm-timesheet-list-table',
  templateUrl: './timesheet-list-table.component.html',
  styleUrls: ['./timesheet-list-table.component.scss']
})
export class TimesheetListTableComponent implements OnInit {

  @Input() timesheets: IViewTimesheet[] = [];

  displayedColumns = ['actions', 'begin', 'end', 'totalHours', 'totalDistance', 'totalExpenses'];

  constructor() { }

  ngOnInit(): void {
  }

  getTotalHours(timesheet: IViewTimesheet) {
    return timesheet.lines.reduce((lacc, line) => {
      return lacc + line.entries.reduce((eacc, entry) => {
        return eacc + entry.time;
      }, 0);
    }, 0);
  }

  getTotalDistance(timesheet: IViewTimesheet) {
    return timesheet.roadsheetLines.reduce((lacc, line) => {
      return lacc + line.travels.reduce((tacc, travel) => {
        return tacc + travel.distance;
      }, 0);
    }, 0);
  }

  getTotalExpenses(timesheet: IViewTimesheet) {
    return timesheet.roadsheetLines.reduce((lacc, line) => {
      return lacc + line.travels.reduce((tacc, travel) => {
        return tacc + travel.expenses.reduce((eacc, expense) => {
          return eacc + expense.amount;
        }, 0);
      }, 0);
    }, 0);
  }

}
