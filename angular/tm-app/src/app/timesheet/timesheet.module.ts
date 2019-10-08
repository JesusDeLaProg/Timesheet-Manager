import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';

import { TimesheetRoutingModule } from './timesheet-routing.module';
import { TimesheetListComponent } from './timesheet-list/timesheet-list.component';
import { TimesheetListTableComponent } from './timesheet-list/timesheet-list-table/timesheet-list-table.component';


@NgModule({
  declarations: [TimesheetListComponent, TimesheetListTableComponent],
  imports: [
    CommonModule,
    TimesheetRoutingModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatPaginatorModule,
    MatTableModule,
  ]
})
export class TimesheetModule { }
