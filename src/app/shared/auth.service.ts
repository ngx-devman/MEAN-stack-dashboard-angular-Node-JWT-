import { Injectable } from '@angular/core';
import { User } from './user';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  endpoint = 'http://localhost:4000/api';
  headers = new HttpHeaders().set('Content-Type', 'appication/json');
  currentUser = {};
  constructor(
    private http: HttpClient,
    public router: Router
  ) { }

  // Sign-up
  signUp(user: User): Observable<any> {
    const api = `${this.endpoint}/register-user`;
    return this.http.post(api, user).pipe(
      catchError(this.handleError)
    );
  }

  // Sign-in
  signIn(user: User) {
    return this.http.post<any>(`${this.endpoint}/signin`, user)
    .subscribe((res: any) => {
      localStorage.setItem('access_token', res.token );
      // tslint:disable-next-line: no-shadowed-variable
      this.getUserProfile(res._id).subscribe((res) => {
        this.currentUser = res.msg;
        this.router.navigate(['default/' + res.msg._id]);
      });
    });
  }

  getToken() {
    return localStorage.getItem('access_token');
  }

  get isLoggedIn(): boolean {
    let authToken = localStorage.getItem('access_token');
    return (authToken !== null) ? true : false;
  }

  doLogout() {
    let removeToken = localStorage.removeItem('access_token');
    if (removeToken == null ) {
      this.router.navigate(['log-in']);
    }
  }

   // User profle
  getUserProfile(id): Observable<any> {
    let api = `${this.endpoint}/default/${id}`;
    return this.http.get(api, { headers: this.headers }).pipe(
      map((res: Response) => {
        return res || { };
      }),
      catchError(this.handleError)
    );
  }

  // Error
  handleError(error: HttpErrorResponse) {
    let msg = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      msg = error.error.message;
    } else {
      // server-side error
      msg = `Error Code: ${error.status}\n Message: ${error.message}`;
    }
    return throwError(msg);
  }
}
