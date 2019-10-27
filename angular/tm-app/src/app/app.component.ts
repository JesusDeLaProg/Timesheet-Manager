import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import * as moment from "moment";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  title = "tm-app";

  constructor(http: HttpClient) {
    http
      .post(
        "http://localhost:8080/api/auth/login",
        { username: "admin", password: "PASSWORD" },
        { withCredentials: true }
      )
      .subscribe();
  }
}
