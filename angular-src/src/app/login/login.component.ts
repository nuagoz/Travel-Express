import { Component, OnInit } from '@angular/core';
import { AuthenticationService, TokenPayload } from '../services/authentication.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  credentials: TokenPayload = {
    mail: '',
    password1: ''
  };

  constructor(private auth: AuthenticationService, private router: Router, private toastr: ToastrService) { }

  login() {
    this.auth.login(this.credentials).subscribe(() => {
      this.router.navigateByUrl('/home');
      this.toastr.success("Connecté", "", { timeOut: 1000 });
    }, err => {
      console.error(err);
    });
  }

  ngOnInit() {
  }

}
