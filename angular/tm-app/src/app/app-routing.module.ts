import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

const routes: Routes = [
  {
    path: "admin",
    loadChildren: () =>
      import("./admin/admin.module").then(mod => mod.AdminModule)
  },
  {
    path: "timesheet",
    loadChildren: () =>
      import("./timesheet/timesheet.module").then(mod => mod.TimesheetModule)
  },
  {
    path: "report",
    loadChildren: () =>
      import("./report/report.module").then(mod => mod.ReportModule)
  },
  { path: "", redirectTo: "timesheet", pathMatch: "full" },
  { path: "**", redirectTo: "" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
