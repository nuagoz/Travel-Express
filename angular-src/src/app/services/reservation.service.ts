import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Http, Response } from '@angular/http';
import { map, filter, scan } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

export interface Reservation {
  idTrajet?: string;
  idPassager?: string;
  nbPassagers?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  constructor(private http: HttpClient, private router: Router, private auth: AuthenticationService) { }

  private request(method: 'post'|'get', type:'booking'|'bookings', reservation?: Reservation, trajetId?: string): Observable<any> {
    let base;

    if(method === 'post' && type === 'booking') {
      reservation.idPassager = this.auth.getUserDetails()._id;
      base = this.http.post(environment.api + "/" + type, reservation, { headers: { Authorization: `Bearer ${this.auth.getToken()}`}});
    }
    else if(method === 'get')
      base = this.http.get(environment.api + "/" + type + "?idTrajet=" + trajetId, { headers: { Authorization: `Bearer ${this.auth.getToken()}`}});

    const request = base.pipe(map(res => { return res; }));
    return request;
  }

  public booking(reservation: Reservation): Observable<any> {
    return this.request('post', 'booking', reservation);
  }

  public getReservations(trajetId: string): Observable<any> {
    return this.request('get', 'bookings', null, trajetId);
  }
}
