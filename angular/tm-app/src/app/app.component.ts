import { HttpClient } from "@angular/common/http";
import { Component } from "@angular/core";
import * as moment from "moment";

@Component({
  selector: "tm-app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  public title = "tm-app";

  constructor(http: HttpClient) {
    http
      .post(
        "http://localhost:8080/api/auth/login",
        { username: "admin", password: "PASSWORD" },
        { withCredentials: true }
      )
      .subscribe();
    http
      .get("http://localhost:8080/api/auth/whoami", { withCredentials: true })
      .subscribe(res => console.log(res));
  }
}
