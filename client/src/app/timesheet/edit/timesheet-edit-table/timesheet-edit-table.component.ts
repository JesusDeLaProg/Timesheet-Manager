import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { ITimesheetLine } from '../../../../../../types/datamodels';
import { IViewTimesheet } from '../../../../../../types/viewmodels';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'tm-timesheet-edit-table',
  templateUrl: './timesheet-edit-table.component.html',
  styleUrls: ['./timesheet-edit-table.component.scss'],
})
export class TimesheetEditTableComponent implements OnInit, AfterViewInit {
  columnsShouldStick = false;

  @Input() timesheet: IViewTimesheet;
  tableColumns: string[] = [];

  constructor() {
    let weekNum = Math.trunc(environment.timesheetLength / 7) - 1;
    const entries = Array(environment.timesheetLength)
      .fill('day')
      .map((v, i) => v + i);
    for (let i = environment.timesheetLength - 1; i >= 0; --i) {
      if (i % 7 === 6) {
        entries.splice(i + 1, 0, 'week' + weekNum);
        --weekNum;
      }
    }

    this.tableColumns = ['project', 'phase', 'activity']
      .concat(entries)
      .concat(['total']);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.columnsShouldStick = true;
    }, 10);
  }

  ngOnInit(): void {}

  dateForColumn(i: number) {
    return this.timesheet.lines[0].entries[i].date;
  }

  totalForColumn(i: number) {
    return this.timesheet.lines.reduce((tot, line) => {
      return tot + line.entries[i].time;
    }, 0);
  }

  totalForLine(line: ITimesheetLine) {
    return line.entries.reduce((tot, entry) => {
      return tot + entry.time;
    }, 0);
  }

  total() {
    return this.timesheet.lines.reduce((tot, line) => {
      return tot + this.totalForLine(line);
    }, 0);
  }

  weekNumberForIndex(i: number) {
    return Math.trunc(i / 7);
  }

  totalForLineAndWeek(line: ITimesheetLine, i: number) {
    return line.entries
      .slice(7 * i, 7 * i + 7)
      .reduce((tot, entry) => tot + entry.time, 0);
  }

  totalForWeek(i: number) {
    return this.timesheet.lines.reduce((tot, line) => {
      return tot + this.totalForLineAndWeek(line, i);
    }, 0);
  }
}
