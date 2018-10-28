import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { map, filter, scan } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http : Http) { }

  getUser(){
    return this.http.get(environment.api + '/user').pipe(map(res => res.json()));
  }

  addUser(){
    
  }

}
