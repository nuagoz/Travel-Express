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
export class UserService {

  constructor(private http: HttpClient, private router: Router, private auth: AuthenticationService) { }

  private request(method: 'post'|'get', type:'board'|'preferences', pref?:any): Observable<any> {
    let base;
    //trajet.idConducteur = this.auth.getUserDetails()._id;
    if(method === 'get')
      base = this.http.get(environment.api + "/" + type, { headers: { Authorization: `Bearer ${this.auth.getToken()}`}});
    else if(method === 'post') {
      pref.userId = this.auth.getUserDetails()._id;
      base = this.http.post(environment.api + "/" + type, pref, { headers: { Authorization: `Bearer ${this.auth.getToken()}`}});
    }

    const request = base.pipe(map(res => { return res; }));
    return request;
  }

  public getBoard(): Observable<any> {
    return this.request('get', 'board');
  }

  public changePref(preference: any): Observable<any> {
    return this.request('post', 'preferences', preference);
  };

}
