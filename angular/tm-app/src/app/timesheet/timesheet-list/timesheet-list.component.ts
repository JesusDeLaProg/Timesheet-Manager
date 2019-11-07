import { Component, OnInit, ViewChild } from "@angular/core";
import { TimesheetService } from "../services/timesheet.service";
import { IViewTimesheet, IViewUser } from "../../../../../../types/viewmodels";
import { UserService } from "src/app/common/services/user.service";
import { PageEvent, MatPaginator } from "@angular/material/paginator";
import { BaseComponent } from "src/app/common/components/base.component";

interface WithTimesheets {
  timesheets?: IViewTimesheet[];
}

interface UserGroup {
  label: string;
  icon: string;
  iconClass: string;
  users: (IViewUser & WithTimesheets)[];
}

@Component({
  selector: "tm-timesheet-list",
  templateUrl: "./timesheet-list.component.html",
  styleUrls: ["./timesheet-list.component.scss"]
})
export class TimesheetListComponent extends BaseComponent implements OnInit {
  @ViewChild(MatPaginator, { static: false })
  private tablePaginator!: MatPaginator;

  public userGroups = new Map<string, UserGroup>();

  public selectedUser: IViewUser & WithTimesheets = null;
  public selectedUserGroup: UserGroup = null;
  public selectedUserTotalTimesheets = 0;

  public get canDeactivate() {
    return true;
  }

  constructor(
    private userService: UserService,
    private timesheetService: TimesheetService
  ) {
    super();
  }

  ngOnInit() {
    this.disposer.add(
      this.userService.getAll({ sort: "lastName" }).subscribe(crudResult => {
        const admin = crudResult.result.find(user => user.username === "admin");
        this.userGroups.set("active", {
          label: "Employés actifs",
          icon: "person",
          iconClass: "user-active",
          users: crudResult.result
            .filter(user => user.isActive && user !== admin)
            .concat([admin])
        });
        this.userGroups.set("inactive", {
          label: "Employés inactifs",
          icon: "lens",
          iconClass: "user-inactive",
          users: crudResult.result.filter(user => !user.isActive)
        });
        this.selectUserGroup("active");
      })
    );
  }

  selectUserGroup(group: string) {
    this.selectedUserGroup = this.userGroups.get(group);
    this.selectUser(this.selectedUserGroup.users[0]);
  }

  selectUser(user: IViewUser & WithTimesheets) {
    this.selectedUser = user;

    if (!user) {
      return;
    }

    if (this.tablePaginator.pageIndex === 0) {
      this.getSelectedUserTimesheets();
    } else {
      this.tablePaginator.firstPage();
    }
  }

  pageChanged(pageEvent: PageEvent) {
    this.getSelectedUserTimesheets();
  }

  getSelectedUserTimesheets() {
    this.disposer.add(
      this.timesheetService
        .getAllByUserId(this.selectedUser._id, {
          limit: this.tablePaginator.pageSize,
          skip: this.tablePaginator.pageSize * this.tablePaginator.pageIndex,
          sort: "-begin"
        })
        .subscribe(timesheets => {
          this.selectedUser.timesheets = timesheets.result;
        })
    );
    this.disposer.add(
      this.timesheetService
        .countByUserId(this.selectedUser._id)
        .subscribe(crudResult => {
          this.selectedUserTotalTimesheets = crudResult.result;
        })
    );
  }
}
