import { Company, Category, AccountBtok, Response1 } from 'src/app/models/user';
import { Injectable } from "@angular/core";
import {
  HttpErrorResponse,
  HttpHeaders,
  HttpClient,
} from "@angular/common/http";
import { throwError, Observable } from "rxjs";
import {  map, tap, catchError } from "rxjs/operators";
import {
  user,
  profileUser,
  registerAccount,
  updatePassword,
  AllMyCompany,
} from "../models/user";
@Injectable({
  providedIn: "root",
})
export class ServerHttpService {
  constructor(private http: HttpClient) {
    if(localStorage.getItem("TOKEN")){
      this.tokenLogin = localStorage.getItem("TOKEN");
      console.log(this.tokenLogin);
    }
  }
  public oldPassword: string;
  public lastCallAPI: number;
  public profileUser: profileUser;
  public tokenLogin: string;
  private REST_API_SERVER = "https://seekproduct-api.misavu.net/";

  private httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
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
  public login(user: user): Observable<any> {
    const url = `${this.REST_API_SERVER}user/login/`;
    this.lastCallAPI = new Date().getTime();
    return this.http
      .post<any>(
        url,
        { email: user.email, password: user.password },
        this.httpOptions
      )
      .pipe(
        catchError(this.handleError),
        tap((res) => {
          if (res) {
            this.oldPassword = user.password;
            // console.log(this.oldPassword);
            this.tokenLogin = res.token;
            localStorage.setItem("TOKEN", res.token);
          }
        })
      );
  }
  public updateProfile(profileUser): Observable<any> {
    console.log(profileUser);
    const url = `${this.REST_API_SERVER}api/auth/profile`;
    const httpOptionsChild = {
      headers: new HttpHeaders({
        // Authorization: 'my-auth-token',
        Authorization: "JWT " + this.tokenLogin,
      }),
    };
    return this.http.put<any>(url, profileUser, httpOptionsChild).pipe(
      catchError(this.handleError),
      tap(
        (res) => {
          if (res) {

            // console.log(profileUser);
            // console.log(res);
            // localStorage.setItem("USER", JSON.stringify(profileUser));
          }
        },
        (error) => {
          console.log(error);
        }
      )
    );
  }
  // public test(data): Observable<any> {
  //   const url = `https://seekproduct-api.misavu.net/api/user/product/?site=bs`;
  //   const httpOptionsChild = {
  //     headers: new HttpHeaders({
  //       "Content-Type": "application/json",
  //       // Authorization: 'my-auth-token',
  //       Authorization: "JWT " + this.tokenLogin,
  //     }),
  //   };
  //   return this.http.post<any>(url, data, httpOptionsChild).pipe(
  //     catchError(this.handleError),
  //     tap(
  //       (res) => {
  //         if (res) {
  //           console.log(res);
  //         }
  //       },
  //       (error) => {
  //         console.log(error);
  //         console.log(this.handleError);
  //       }
  //     )
  //   );
  // }

  public refreshToken(): Observable<any> {
    const url = `${this.REST_API_SERVER}api-token-refresh/`;
    const httpOptionsChild = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        // Authorization: 'my-auth-token',
        Authorization: "JWT " + this.tokenLogin,
      }),
    };
    return this.http
      .post<any>(url, { token: this.tokenLogin }, httpOptionsChild)
      .pipe(
        catchError(this.handleError),
        tap((res) => {
          if (res) {
            localStorage.setItem("TOKEN", res.token);
          }
        })
      );
  }
  public forgotPassword(email: string): Observable<any> {
    const url = `${this.REST_API_SERVER}api/auth/forgot-password`;
    return this.http.post<any>(url, { email: email }, this.httpOptions).pipe(
      catchError(this.handleError),
      tap((res) => {
        if (res) {
          // console.log(res);
        }
      })
    );
  }
  public updatePassword(updatePassword: updatePassword): Observable<any> {
    const url = `${this.REST_API_SERVER}api/auth/change_pass`;
    const httpOptionsChild = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        // Authorization: 'my-auth-token',
        Authorization: "JWT " + this.tokenLogin,
      }),
    };
    return this.http.put<any>(url, updatePassword, httpOptionsChild).pipe(
      catchError(this.handleError),
      tap(
        (res) => {
          if (res) {
            // console.log(res);
            this.oldPassword = updatePassword.new_password;
          }
        },
        (error) => {
          // console.log(error);
        }
      )
    );
  }

  public getProfile(): Observable<profileUser> {
    if (this.tokenLogin) {
      var httpOptions1 = {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          // Authorization: 'my-auth-token',
          Authorization: "JWT " + this.tokenLogin,
        }),
      };
      // this.httpOptions.headers.append('Authorization','JWT ' + this.tokenLogin);
    }
    const url = `${this.REST_API_SERVER}api/auth/profile`;

    return (
      this.http
        // {headers: new HttpHeaders({'Authorization': 'JWT ' + this.tokenLogin})}
        // this.httpOptions
        .get<any>(url, httpOptions1)
        .pipe(
          catchError(this.handleError),
          tap((res) => {
            localStorage.setItem("USER", JSON.stringify(res));
            // let a;
            // a = localStorage.getItem("USER");
            // console.log(JSON.parse(a));
          })
        )
    );
  }

  public logout() {
    const url = `${this.REST_API_SERVER}user/logout/`;
    const token = localStorage.getItem("TOKEN");
    const httpOptionsChild = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        // Authorization: 'my-auth-token',
        Authorization: "JWT " + token,
      }),
    };
    // httpOptionsChild.headers.append('Authorization','JWT ' + this.tokenLogin);
    return this.http.get<any>(url, httpOptionsChild).pipe(
      catchError(this.handleError),
      tap((res) => {
        // console.log(res);
        this.tokenLogin = "";
        localStorage.removeItem("TOKEN");
        localStorage.removeItem("USER");
        localStorage.removeItem("ALLCOMPANY");
        localStorage.removeItem("ALLMYCOMPANY");
      })
    );
  }
  public register(data: registerAccount) {
    const url = `${this.REST_API_SERVER}api/auth/register/`;
    return this.http.post<any>(url, data, this.httpOptions).pipe(
      catchError(this.handleError),
      tap((res) => {
        // console.log(res);
      })
    );
  }

  public shouldCallAPIrefreshToken() {
    const now = new Date().getTime();
    if (now - this.lastCallAPI > 600000) {
      this.refreshToken().subscribe((data) => (this.tokenLogin = data.token));
      this.lastCallAPI = now;
    }
    // else{
    //   console.log('ko chay');
    // }
  }

  // Company
  public temp:[];
  public GetAllMyCompany(i): Observable<AllMyCompany> {

    const url = `${this.REST_API_SERVER}api/user/company/all-my-company/?page=${i}`;
    const httpOptionsChild = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        // Authorization: 'my-auth-token',
        Authorization: "JWT " + this.tokenLogin,
      }),
    };
    return this.http.get<any>(url,  httpOptionsChild).pipe(
      catchError(this.handleError),
      tap(
        (res) => {
          // localStorage.setItem("ALLMYCOMPANY", JSON.stringify(res));
          // if (res) {
          //   if(res.next!=null){
          //     // this.temp = res.results;
          //     this.temp = res;
          //     console.log('a');
          //     // this.test1();
          //   // console.log(res);
          // }

          //   console.log(this.temp);
          //   // this.oldPassword = updatePassword.new_password;
          // }
        },
        (error) => {
          console.log(error);
        }
      )
    );
  }
  // public test2(){
  //   // this.http.get(url+'?page=3',httpOptionsChild).pipe(
  //   //   catchError(this.handleError),
  //   //   tap((res2:Response1)=>{
  //   //     if(res2.next!=null){
  //   //       if(res2.results){
  //   //         res2.results.forEach((data1)=>{
  //   //           temp.push(data1);
  //   //         })
  //   //         console.log(temp);
  //   //       }
  //   //     }
  //   //   })
  //   //   )
  // }

  public test1(){
    const httpOptionsChild = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        // Authorization: 'my-auth-token',
        Authorization: "JWT " + this.tokenLogin,
      }),
    };
    this.http.get('https://seekproduct-api.misavu.net/api/user/company/all-my-company/?page=2',httpOptionsChild).pipe(
      catchError(this.handleError),
      tap((res1:Response1)=>{
        console.log('b');
        if(res1.next!=''){
          // if(res1.results){
              res1.results.forEach((data)=>{
                this.temp.push(data);
              })
              console.log(this.temp);



          // }
        }
      },
      (error)=>{
        console.log(error);
      }
      ),

    )
  }
// get detail company
public detailCompany(id): Observable<Company> {
  const url = ` https://seekproduct-api.misavu.net/api/user/company/detail/${id}`;
    const httpOptionsChild = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        // Authorization: 'my-auth-token',
        Authorization: "JWT " + this.tokenLogin,
      }),
    };
    return this.http.get<any>(url,  httpOptionsChild).pipe(
      catchError(this.handleError),
      tap(
        (res) => {
          if (res) {
            // console.log(res);
          }
        },
        (error) => {
          console.log(error);
        }
      )
    );
}
// get name category
public getCategory(site):Observable<any> {
  const url = `https://seekproduct-api.misavu.net/api/company/category?site=${site}`;
  const httpOptionsChild = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: 'my-auth-token',
      Authorization: "JWT " + this.tokenLogin,
    }),
  };
  return this.http.get<any>(url,  httpOptionsChild).pipe(
    catchError(this.handleError),
    tap(
      (res) => {
        if (res) {
          // console.log(res);
        }
      },
      (error) => {
        console.log(error);
      }
    )
  );
}

// get all category

public getAllCategory():Observable<any>{
  const url = `https://seekproduct-api.misavu.net/api/category`;
  const token = localStorage.getItem("TOKEN");
  const httpOptionsChild = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: 'my-auth-token',
      Authorization: "JWT " + token,
    }),
  };
  return this.http.get<any>(url,  httpOptionsChild).pipe(
    catchError(this.handleError),
    tap(
      (res) => {
        if (res) {
          // console.log(res);
        }
      },
      (error) => {
        console.log(error);
      }
    )
  );
}
public createCompany(data) {
  const url = `https://seekproduct-api.misavu.net/api/user/company/`;
  const httpOptionsChild = {
    headers: new HttpHeaders({
      // "Content-Type": 'multipart/form-data',
      // "Content-Type": 'application/x-www-form-urlencoded',
      // "Content-Type": 'application/json; boundary=<calculated when request is sent>',
      // "Content-Length":"<calculated when request is sent>",
      // "Accept" : "application/json",
      // "Accept-Encoding": "gzip, deflate, br",
      // Authorization: 'my-auth-token',
      Authorization: "JWT " + this.tokenLogin,
    }),
  };
  return this.http.post<any>(url, data, httpOptionsChild).pipe(
    catchError(this.handleError),
    tap((res) => {

    }
    , (err) => {
      // console.error(err);
    })
  );
}

// bank token (btok)
public getBtok(data: AccountBtok):Observable<any>{
  const url = `https://seekproduct-api.misavu.net/api/category`;
  const setdata:AccountBtok = {
    country :"AU",
    name : "Dave",
    routing : 110000,
    account : "000123456",
  };
  const token = localStorage.getItem("TOKEN");
  const httpOptionsChild = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: 'my-auth-token',
      Authorization: "JWT " + token,
    }),
  };
  return this.http.post<any>(url, setdata , httpOptionsChild).pipe(
    catchError(this.handleError),
    tap(
      (res) => {
        if (res) {
          // console.log(res);
        }
      },
      (error) => {
        console.log(error);
      }
    )
  );
}

// connect stripe GET request
public getConnectStripe() {
  const token = localStorage.getItem("TOKEN");
  const url = `https://seekproduct-api.misavu.net/api/user/company/oauth-link`;
  const httpOptionsChild = {
    headers: new HttpHeaders({
      "Content-Type": 'multipart/form-data',
      // "Content-Type": 'application/x-www-form-urlencoded',
      // "Content-Type": 'application/json; boundary=<calculated when request is sent>',
      // "Content-Length":"<calculated when request is sent>",
      "Accept" : "application/json",
      // "Accept-Encoding": "gzip, deflate, br",
      // Authorization: 'my-auth-token',
      Authorization: "JWT " + token,
    }),
  };
  return this.http.get<any>(url,  httpOptionsChild).pipe(
    catchError(this.handleError),
    tap((res) => {
      // console.log(res);
    })
  );
}
// social_link
public addSocialLink(id_company,data) {
  const token = localStorage.getItem("TOKEN");
  const url = `https://seekproduct-api.misavu.net/api/user/company/add-social-link/${id_company}`;
  const httpOptionsChild = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
      // "Content-Type": 'application/x-www-form-urlencoded',
      // "Content-Type": 'application/json; boundary=<calculated when request is sent>',
      // "Content-Length":"<calculated when request is sent>",
      // "Accept-Encoding": "gzip, deflate, br",
      // Authorization: 'my-auth-token',
      Authorization: "JWT " + token,
    }),
  };
  return this.http.post<any>(url,data,  httpOptionsChild).pipe(
    catchError(this.handleError),
    tap((res) => {
      // console.log(res);
    }, (err) =>  {

    }
    )
  );
}
public updateBanner(id_company,data) {
  const token = localStorage.getItem("TOKEN");
  const url = `https://seekproduct-api.misavu.net/api/user/company/detail/${id_company}`;
  const httpOptionsChild = {
    headers: new HttpHeaders({
      // "Content-Type": 'application/x-www-form-urlencoded',
      // "Content-Type": 'application/json; boundary=<calculated when request is sent>',
      // "Content-Length":"<calculated when request is sent>",
      // "Accept-Encoding": "gzip, deflate, br",
      // Authorization: 'my-auth-token',
      Authorization: "JWT " + token,
    }),
  };
  return this.http.put<any>(url,data,  httpOptionsChild).pipe(
    catchError(this.handleError),
    tap((res) => {
      // console.log(res);
    }, (err) =>  {

    }
    )
  );
}

public updateCompany(id_company,data) {
  const token = localStorage.getItem("TOKEN");
  const url = `https://seekproduct-api.misavu.net/api/user/company/detail/${id_company}`;
  const httpOptionsChild = {
    headers: new HttpHeaders({
      // "Content-Type": 'application/x-www-form-urlencoded',
      // "Content-Type": 'application/json; boundary=<calculated when request is sent>',
      // "Content-Length":"<calculated when request is sent>",
      // "Accept-Encoding": "gzip, deflate, br",
      // Authorization: 'my-auth-token',
      Authorization: "JWT " + token,
    }),
  };
  return this.http.put<any>(url,data,  httpOptionsChild).pipe(
    catchError(this.handleError),
    tap((res) => {
      // console.log(res);
    }, (err) =>  {

    }
    )
  );
}
  private handleError(error: HttpErrorResponse) {
    console.log(error.status);
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error("An error occurred:", error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
      console.error(error.error);
    }
    // return an observable with a user-facing error message
    // return throwError("Something bad happened; please try again later."+error.error);
    return throwError(error);
  }
}
