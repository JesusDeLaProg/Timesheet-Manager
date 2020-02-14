import { Component, OnInit, Input } from "@angular/core";
import * as moment from "moment";
import { IViewTimesheet } from "../../../../../../../types/viewmodels";

@Component({
  selector: "tm-timesheet-list-table",
  templateUrl: "./timesheet-list-table.component.html",
  styleUrls: ["./timesheet-list-table.component.scss"]
})
export class TimesheetListTableComponent implements OnInit {
  public readonly moment = moment;

  @Input() public timesheets;

  constructor() {}

  ngOnInit() {}

  getTotalTime(timesheet: IViewTimesheet) {
    return timesheet.lines.reduce((tot, line) => {
      return (
        tot + line.entries.reduce((lineTot, entry) => lineTot + entry.time, 0)
      );
    }, 0);
  }
}
