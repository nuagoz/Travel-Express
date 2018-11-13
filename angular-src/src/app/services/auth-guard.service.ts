import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private auth: AuthenticationService, private router: Router, private toastr: ToastrService) { }

  /**
   * Redirige un utilisateur non connecté à la page de connexion lorsqu'il veut
   * accéder à une page nécéssitant d'être authentifié.
   */
  canActivate(){
    if(!this.auth.isLoggedIn()) {
      this.router.navigateByUrl('/login');
      this.toastr.error("Vous devez être connecté pour accéder à cette page", "Erreur !", { timeOut: 1500 });
      return false;
    }
    return true;
  }
}
