import { Component, OnInit } from '@angular/core';
import { ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'tm-timesheet-edit',
  templateUrl: './timesheet-edit.component.html',
  styleUrls: ['./timesheet-edit.component.scss'],
})
export class TimesheetEditComponent implements OnInit {
  constructor(route: ActivatedRoute) {
    console.log(route.snapshot.params);
  }

  ngOnInit(): void {}
}
