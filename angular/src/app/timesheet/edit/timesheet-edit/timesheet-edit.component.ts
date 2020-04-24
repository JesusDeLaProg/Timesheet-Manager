import { Component, OnInit } from '@angular/core';
import { ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'tm-timesheet-edit',
  templateUrl: './timesheet-edit.component.html',
  styleUrls: ['./timesheet-edit.component.scss'],
})
export class TimesheetEditComponent implements OnInit {
  timesheetId: string;

  constructor(route: ActivatedRoute) {
    this.timesheetId = route.snapshot.params.id;
  }

  ngOnInit(): void {}
}
