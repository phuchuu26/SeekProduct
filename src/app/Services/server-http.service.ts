import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpHeaders, HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { user } from '../models/user';
@Injectable({
  providedIn: 'root'
})
export class ServerHttpService {
  constructor(
    private http: HttpClient
  ) { }
  public tokenLogin:string;
  private REST_API_SERVER = "https://seekproduct-api.misavu.net/";

  private httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/x-www-form-urlencoded",
      // Authorization: 'my-auth-token',
      // Authorization: 'Basic ' + btoa('username:password'),
    }),
  };
  //
  // public login(user:user){
  //   const url = `${this.REST_API_SERVER}user/login/`;
  //   return this.http
  //   .post<any>(url,  {params: {email: user.email, password: user.password}})
  //   // .post<any>(url, object, this.httpOptions)
  //   .pipe(catchError(this.handleError));
  // };
  public login(user:user){
    const url = `${this.REST_API_SERVER}user/login/`;
    return this.http
    .post<any>(url,{email: user.email, password: user.password})
    .pipe(catchError(this.handleError));
  };
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error("An error occurred:", error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
    // return an observable with a user-facing error message
    return throwError("Something bad happened; please try again later.");
  }
}
