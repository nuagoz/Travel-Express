import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Http, Response } from '@angular/http';
import { map, filter, scan } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

export interface UserDetails {
  _id: string;
  prenom: string;
  nom: string;
  tel: string;
  exp: number;
  iat: number;
}

export interface TokenResponse {
  token: string;
}

export interface TokenPayload {
  prenom?: string;
  nom?: string;
  tel?: string;
  mail: string;
  password1: string;
  password2?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private token: string;

  constructor(private http: HttpClient, private router: Router) {}

  private saveToken(token: string): void {
    localStorage.setItem('mean-token', token);
    this.token = token;
  }

  private getToken(): string {
    if(!this.token)
      this.token = localStorage.getItem('mean-token');
    
    return this.token;
  }

  public logout(): void {
    this.token = '';
    window.localStorage.removeItem('mean-token');
    this.router.navigateByUrl('/home');
  }

  public getUserDetails(): UserDetails {
    const token = this.getToken();
    let payload;
    if(token){
      payload = token.split('.')[1];
      payload = window.atob(payload);
      return JSON.parse(payload);
    }
    return null;
  }

  public isLoggedIn(): boolean {
    const user = this.getUserDetails();
    return user ? user.exp > Date.now() / 1000 : false;
  }

  private request(method: 'post'|'get', type:'login'|'register'|'profile', user?: TokenPayload): Observable<any> {
    let base;

    if(method == 'post')
      base = this.http.post(environment.api + "/" + type, user);
    else
      base = this.http.get(environment.api + "/" + type, { headers: { Authorization: `Bearer ${this.getToken()}`}});

    const request = base.pipe(
      map((data: TokenResponse) => {
        if(data.token)
          this.saveToken(data.token);

        return data;
      })
    );

    return request;
  }

  public register(user: TokenPayload): Observable<any> {
    return this.request('post', 'register', user);
  }

  public login(user: TokenPayload): Observable<any> {
    return this.request('post', 'login', user);
  }

  public profile(): Observable<any> {
    return this.request('get', 'profile');
  }
}
