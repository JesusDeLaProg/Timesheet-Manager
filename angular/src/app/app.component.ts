import { Component, AfterViewInit } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'tm-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'tm-app';

  get whoami() {
    return this.authService.whoami();
  }

  constructor(private authService: AuthService) {}
}
