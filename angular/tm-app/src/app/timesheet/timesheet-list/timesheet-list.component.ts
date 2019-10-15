import { Component, OnInit } from "@angular/core";

@Component({
  selector: "tm-timesheet-list",
  templateUrl: "./timesheet-list.component.html",
  styleUrls: ["./timesheet-list.component.scss"]
})
export class TimesheetListComponent implements OnInit {
  public selectedUser = 1;

  constructor() {}

  ngOnInit() {}
}
