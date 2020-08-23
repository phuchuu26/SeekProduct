import { profileUser } from './../../models/user';
import { ServerHttpService } from './../../Services/server-http.service';
import { Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { user } from 'src/app/models/user';
import {SnotifyService} from 'ng-snotify';
import { SnotifyPosition } from "ng-snotify";
import Swal from 'sweetalert2'
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

    // hoale7602@gmail.com
    // phucsteam98@gmail.com
    email: new FormControl("phucsteam98@gmail.com", [Validators.required, ]),
    // emailValidator()
    password: new FormControl("123123", [
      Validators.required,
      Validators.minLength(5),
    ]),

  });
  public save(){

      this.server.login(this.submit()).subscribe((  data )=>{
        this.server.tokenLogin = data.token;
        // console.log(this.server.tokenLogin);
        if(this.server.tokenLogin){
          this.server.getProfile().subscribe((data1)=>{
            // console.log(data1);
            this.server.profileUser = data1;
            // console.log(this.server.profileUser);
            this.success(this.server.profileUser.first_name,this.server.profileUser.last_name);
          })

          this.server.GetAllMyCompany().subscribe((data)=>{

          });
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
          // console.log(this.userForm.controls[a].value);
          user[a] = this.userForm.controls[a].value;
        }
      }
      return user as user;
    }

    public success(a,b){
      this.snotify.info(`Chào mừng ${a} ${b} đã đăng nhập thành công`, "Xác nhận", {
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


    public forgetPassword() {
      Swal.fire({
        title: 'Submit your Account email ',
        input: 'text',
        inputAttributes: {
          autocapitalize: 'off'
        },
        showCancelButton: true,
        confirmButtonText: 'Look up',
        showLoaderOnConfirm: true,
        preConfirm: (login) => {
          this.server.forgotPassword(login).subscribe((data)=>{
            Swal.fire({
              title: `Please check your email ${login} `,
              icon:`success`,
              footer: '<a href="https://mail.google.com/">Please click this link to enter the email</a>'
            } )
          },
          // (error)=>{
          //   Swal.fire(

          //     title:   `Request failed: Enter the wrong email`,
          //     icon:`success`
          //         )
          // }
          )
          // return fetch(`https://seekproduct-api.misavu.net/api/auth/forgot-password`)
          //   .then(response => {
          //     if (!response.ok) {
          //       throw new Error(response.statusText)
          //     }
          //     return response.json()
          //   })
          //   .catch(error => {
          //     Swal.showValidationMessage(
          //       `Request failed: ${error}`
          //     )
          //   })
        },

        allowOutsideClick: () => !Swal.isLoading()
      }).then((result) => {
        if (result) {
          Swal.fire({
            title: `Your email: ${result.value}`,
            icon: `error`,
            text: 'Your email went wrong!',
          })
        }
      }
      )
    }
  }
