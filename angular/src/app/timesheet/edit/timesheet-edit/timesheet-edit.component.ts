import { Component, OnInit } from '@angular/core';
import { ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';
import { TimesheetService } from 'src/app/services/timesheet.service';
import { IViewTimesheet } from '../../../../../../types/viewmodels';

@Component({
  selector: 'tm-timesheet-edit',
  templateUrl: './timesheet-edit.component.html',
  styleUrls: ['./timesheet-edit.component.scss'],
})
export class TimesheetEditComponent implements OnInit {
  timesheetId: string;

  timesheet: IViewTimesheet;

  constructor(
    route: ActivatedRoute,
    private timesheetService: TimesheetService
  ) {
    this.timesheetId = route.snapshot.params.id;
  }

  async ngOnInit(): Promise<void> {
    this.timesheet = (
      await this.timesheetService.getById(this.timesheetId).toPromise()
    ).result;
    console.log(this.timesheet);
  }
}
