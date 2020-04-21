import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TimesheetListComponent } from './timesheet/list/timesheet-list/timesheet-list.component';


const routes: Routes = [
  { path: 'timesheet/list', component: TimesheetListComponent },
  { path: '', pathMatch: 'full', component: TimesheetListComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
