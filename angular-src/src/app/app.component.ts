import { Component } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import 'hammerjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Travel Express';
  constructor(public auth: AuthenticationService) {}
}
