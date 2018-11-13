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
  heureArrivee?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TrajetService {

  constructor(private http: HttpClient, private router: Router, private auth: AuthenticationService) { }

  private request(method: 'post'|'get', type:'trajet'|'search'|'lift', trajet?: Trajet, id?: string): Observable<any> {
    let base;

    if(method === 'post' && type === 'search') {
      base = this.http.post(environment.api + "/" + type, trajet);
    }
    else if(method === 'post' && type === 'trajet') {
      trajet.idConducteur = this.auth.getUserDetails()._id;
      base = this.http.post(environment.api + "/" + type, trajet, { headers: { Authorization: `Bearer ${this.auth.getToken()}`}});
    }
      //base = this.http.post(environment.api + "/" + type, user);
    else if(method === 'get')
      base = this.http.get(environment.api + "/" + type + "/" + id, { headers: { Authorization: `Bearer ${this.auth.getToken()}`}});

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
  
  /**
   * Ajoute un trajet créé par le formulaire
   */
  public addTrajet(trajet: Trajet): Observable<any> {
    return this.request('post', 'trajet', trajet);
  }

  public getTrajet(id: string): Observable<any> {
    return this.request('get', 'lift', null, id);
  }

}
