import { Component, OnInit } from '@angular/core';
import { TimesheetService } from 'src/app/services/timesheet.service';
import { UserService } from 'src/app/services/user.service';
import { flatMap, map } from 'rxjs/operators';
import { IViewUser } from '../../../../../../types/viewmodels';
import { IQueryOptions } from 'src/app/services/base-data.service';

@Component({
  selector: 'tm-timesheet-list',
  templateUrl: './timesheet-list.component.html',
  styleUrls: ['./timesheet-list.component.scss']
})
export class TimesheetListComponent implements OnInit {

  users$ = this.userService.getAll();

  private _timesheetQueryOptions: IQueryOptions;
  set timesheetQueryOptions(options: IQueryOptions) {
    if(this._timesheetQueryOptions.limit === options.limit &&
      this._timesheetQueryOptions.skip === options.skip &&
      this._timesheetQueryOptions.sort === options.sort) return;
    this.updateTimesheetsQuery();
  }
  get timesheetQueryOptions() {
    return this._timesheetQueryOptions;
  }

  private _selectedUser: IViewUser;
  set selectedUser(user: IViewUser) {
    if(this._selectedUser === user) return;
    this._selectedUser = user;
    this.updateTimesheetsQuery();
  }
  get selectedUser() {
    return this._selectedUser;
  }

  timesheets$ = this.users$
  .pipe(
    map(res => res.result),
    flatMap(users => this.timesheetService
      .getAllByUser(users.find(u => u.username === 'fcharland')._id, { sort: '-begin' })
      .pipe(map(res => res.result))));

  constructor(
    private timesheetService: TimesheetService,
    private userService: UserService) { }

  ngOnInit(): void {
  }

  private updateTimesheetsQuery() {
    this.timesheets$ = this.timesheetService.getAllByUser(this.selectedUser._id, this.timesheetQueryOptions)
      .pipe(map(res => res.result));
  }

}
