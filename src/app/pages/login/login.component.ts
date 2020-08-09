import { ServerHttpService } from './../../Services/server-http.service';
import { Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { user } from 'src/app/models/user';
import {SnotifyService} from 'ng-snotify';
import { SnotifyPosition } from "ng-snotify";
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  constructor( private router: Router,
    private server: ServerHttpService,
    private snotify: SnotifyService,
    ) {

  }

  ngOnInit() {
  }
  ngOnDestroy() {
  }

  public userForm = new FormGroup({

    email: new FormControl("admin@gmail.com", [Validators.required, ]),
    // emailValidator()
    password: new FormControl("admin@1234", [
      Validators.required,
      Validators.minLength(5),
    ]),

  });
  public save(){

      this.server.login(this.submit()).subscribe((  data )=>{
        this.server.tokenLogin = data;
        console.log(this.server.tokenLogin);
        if(data){
          this.success(this.userForm.controls.email.value);
        }
        this.router.navigate(["dashboard"]);
     },
    (error)=>{
      console.log(error);
      this.failed();
    }
    );

    }
    public submit(){
      const user={};
      for( const a in this.userForm.controls){
        if(a){
          console.log(this.userForm.controls[a].value);
          user[a] = this.userForm.controls[a].value;
        }
      }
      return user as user;
    }

    public success(a){
      this.snotify.info(`Chào mừng ${a} đã đăng nhập thành công`, "Xác nhận", {
        position: SnotifyPosition.rightTop,
        timeout: 3000,
        showProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
      });
    }

    public failed(){
      this.snotify.error(`Đăng nhập thất bại `, "Xác nhận", {
        position: SnotifyPosition.rightTop,
        timeout: 3000,
        showProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
      });
    }


}
