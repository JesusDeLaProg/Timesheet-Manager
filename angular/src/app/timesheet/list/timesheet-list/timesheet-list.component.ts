import { Component, OnInit, OnDestroy } from '@angular/core';
import { TimesheetService } from 'src/app/services/timesheet.service';
import { UserService } from 'src/app/services/user.service';
import { map } from 'rxjs/operators';
import { IViewUser, IViewTimesheet } from '../../../../../../types/viewmodels';
import { IQueryOptions } from 'src/app/services/base-data.service';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription, Observable, of } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'tm-timesheet-list',
  templateUrl: './timesheet-list.component.html',
  styleUrls: ['./timesheet-list.component.scss'],
})
export class TimesheetListComponent implements OnInit, OnDestroy {
  readonly DEFAULT_PAGE_SIZE = 5;
  readonly PAGE_SIZE_OPTIONS = [5, 10, 25, 100];

  private subscriptions = new Subscription();

  users$ = this.userService.getAll({ sort: '-isActive lastName' }).pipe(
    map((res) => res.result),
    map((users) => users.filter((u) => u.username !== 'admin'))
  );

  private _selectedUser: IViewUser;
  set selectedUser(user: IViewUser) {
    if (this._selectedUser === user) {
      return;
    }
    this._selectedUser = user;
    this.updateTimesheetsQuery();
  }
  get selectedUser() {
    return this._selectedUser;
  }

  set pageEvent(event: PageEvent) {
    this.updateTimesheetsQuery({
      sort: '-begin',
      limit: event.pageSize,
      skip: event.pageIndex * event.pageSize,
    });
  }

  private _timesheetQueryOptions: IQueryOptions = {
    sort: '-begin',
    skip: 0,
    limit: this.DEFAULT_PAGE_SIZE,
  };

  timesheets$: Observable<IViewTimesheet[]> = of([] as IViewTimesheet[]);
  timesheetCount$: Observable<number> = of(0);

  constructor(
    authService: AuthService,
    private timesheetService: TimesheetService,
    private userService: UserService
  ) {
    this.subscriptions.add(
      authService.whoami().subscribe((user) => (this.selectedUser = user))
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  ngOnInit(): void {}

  private updateTimesheetsQuery(queryOptions?: IQueryOptions) {
    if (queryOptions) {
      this._timesheetQueryOptions = queryOptions;
    }
    this.timesheets$ = this.timesheetService
      .getAllByUserId(this.selectedUser._id, this._timesheetQueryOptions)
      .pipe(map((res) => res.result));
    this.timesheetCount$ = this.timesheetService
      .countByUserId(this.selectedUser._id)
      .pipe(map((res) => res.result));
  }
}
