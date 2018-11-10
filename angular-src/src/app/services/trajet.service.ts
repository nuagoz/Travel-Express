import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Http, Response } from '@angular/http';
import { map, filter, scan } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

export interface Trajet {
  idConducteur?: string;
  date?: string;
  villeDepart?: any;
  villeArrivee?: any;
  nbPlaces?: string;
  tarif?: string;
  heureDepart?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TrajetService {

  constructor(private http: HttpClient, private router: Router, private auth: AuthenticationService) { }

  private request(method: 'post'|'get', type:'trajet'|'search', trajet?: Trajet): Observable<any> {
    let base;

    if(method === 'post' && type === 'search'){
      base = this.http.post(environment.api + "/" + type, trajet);
    }
      //base = this.http.post(environment.api + "/" + type, user);
    else
      base = this.http.get(environment.api + "/" + type, { headers: { Authorization: `Bearer ${this.auth.getToken()}`}});
    const request = base.pipe(map(res => { return res; }));

    return request;
  }

  /**
   * Recherche les covoiturages disponibles suivant les critères de recherche
   * @param trajet 
   */
  public search(trajet: Trajet): Observable<any> {
    return this.request('post', 'search', trajet);
  }

}
