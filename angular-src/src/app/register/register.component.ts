import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService, TokenPayload } from '../services/authentication.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  credentials: TokenPayload = {
    prenom: '',
    nom: '',
    tel: '',
    mail: '',
    password1: '',
    password2: ''
  };
  formError: Boolean = false;
  msgError: String;

  constructor(private auth: AuthenticationService, private router: Router, private toastr: ToastrService) { }

  register() {
    this.auth.register(this.credentials).subscribe(response => {
      if(response.success === false){ // erreur dans l'inscription -> ne pas mettre !response.success
        this.formError = true;
        this.msgError = response.msg;
      }
      else { // inscription OK
        this.formError = false;
        this.toastr.success("Vous pouvez vous connecter", "Inscription réussie !");
        this.router.navigateByUrl('/login');
      }
    }, err => {
      console.error(err);
    });
  }
  
  ngOnInit() {
  }

}
