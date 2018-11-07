import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(public auth: AuthenticationService, public toastr: ToastrService) { }

  ngOnInit() {
  }

  logout() {
    this.auth.logout();
    this.toastr.error("Déconnecté", "", { timeOut: 1000 });
  }

}
