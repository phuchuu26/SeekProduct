import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpHeaders, HttpClient } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { user, profileUser } from '../models/user';
@Injectable({
  providedIn: 'root'
})
export class ServerHttpService {
  constructor(
    private http: HttpClient
  ) { }

  public lastCallAPI: number;
  public profileUser:profileUser;
  public tokenLogin:string;
  private REST_API_SERVER = "https://seekproduct-api.misavu.net/";

  private httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json"
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
  public login(user:user): Observable<any>{
    const url = `${this.REST_API_SERVER}user/login/`;
    this.lastCallAPI = new Date().getTime();
    return this.http
    .post<any>(url, {email: user.email, password: user.password}, this.httpOptions)
    .pipe(catchError(this.handleError));
  };

  public refreshToken(): Observable<any>{
    const url = `${this.REST_API_SERVER}api-token-refresh/`;
    return this.http
    .post<any>(url,{token: this.tokenLogin},  this.httpOptions )
    .pipe(catchError(this.handleError));
  }

  public getProfile(): Observable<profileUser>{


    if(this.tokenLogin){
      var httpOptions1 = {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          // Authorization: 'my-auth-token',
          Authorization: 'JWT ' + this.tokenLogin,
        }),
      };
      // this.httpOptions.headers.append('Authorization','JWT ' + this.tokenLogin);
    }
    const url = `${this.REST_API_SERVER}api/auth/profile`;

    return this.http
    // {headers: new HttpHeaders({'Authorization': 'JWT ' + this.tokenLogin})}
    // this.httpOptions
    .get<any>(url,httpOptions1 )
    .pipe(catchError(this.handleError));
  }

  public  shouldCallAPIrefreshToken(){
    const now = new Date().getTime();
    if((now - this.lastCallAPI) > 600000){
      this.refreshToken().subscribe((data)=>
        this.tokenLogin = data.token
      );
      this.lastCallAPI = now;
    }
    // else{
    //   console.log('ko chay');
    // }
}

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
