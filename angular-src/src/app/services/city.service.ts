import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { map, filter, scan } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

export interface City {
  nom: string;
}

@Injectable({
  providedIn: 'root'
})
export class CityService {

  constructor(private http: Http) { }

  /**
   * Récupération des villes en BD
   */
  public getCities(): Observable<any>{
    return this.http.get(environment.api + '/cities').pipe(map(res => res.json()));
  }
}
