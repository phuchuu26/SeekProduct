import { Component, OnInit, DoCheck } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ServerHttpService } from 'src/app/Services/server-http.service';
import {  updatePassword } from 'src/app/models/user';
import { SnotifyService, SnotifyPosition } from 'ng-snotify';
import { emailValidator, confirmPasswordValidator1 } from 'src/app/custom-validation/CustomValidators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.css']
})
export class UpdatePasswordComponent implements OnInit, DoCheck {
  public updatePasswordForm: FormGroup;
  public error = {old_password : '', new_password: '',confirm_password: ''};
  public oldpass: string;

  constructor(
    private forms: FormBuilder,
    private http: ServerHttpService,
    private snotify: SnotifyService,
    private router: Router

  ) { }
  ngDoCheck(): void {
    this.checkValidAccount();
  }
  ngOnInit(): void {
    this.oldpass = this.http.oldPassword;
    this.updatePasswordForm = this.forms.group({
      pass: new FormControl(this.oldpass),
      old_password: new FormControl("", [Validators.required,this.passwordCheck]),
      new_password : new FormControl("", [Validators.required, Validators.minLength(5),Validators.maxLength(15)]),
      confirm_password: new FormControl("", [Validators.required,this.passwordCheck1]),

    });
  }

  public submit(){
    const account = {};
    for( const a in this.updatePasswordForm.controls){
      if(a){
        console.log(this.updatePasswordForm.controls[a].value);
        account[a] = this.updatePasswordForm.controls[a].value;
      }
    }
    return account as updatePassword;
  }
  public save(){
    this.http.updatePassword(this.submit()).subscribe((data)=>{

      console.log(data);
      this.success();
      this.updatePasswordForm.reset();
      // window.location.reload();
    }, (error)=>{
      this.failed();
    })

  }
  public passwordCheck(control){
    // console.log(control);
    if(control.value != null){
      var conPass = control.value;
      var pass = control.root.get('pass');
      if(pass){
        var password = pass.value;
        if(conPass !== "" && password !== ""){
          if(conPass !== password){
            return {error: "Passwords do not match"}
          }
          else{
            return null;
          }
        }
      }
    }
  }


  public passwordCheck1(control){
    // console.log(control);
    if(control.value != null){
      var conPass = control.value;
      var pass = control.root.get('new_password');
      if(pass){
        var password = pass.value;
        if(conPass !== "" && password !== ""){
          if(conPass !== password){
            return {error: "Passwords do not match"}
          }
          else{
            return null;
          }
        }
      }
    }
  }

  public checkConfirmPassword() {
    if(this.updatePasswordForm.controls.old_password.value === this.http.oldPassword){
      return true;
    }
    else{
      return false;
    }
    // return this.updatePasswordForm.controls.password.value === this.updatePasswordForm.controls.confirm_password.value;
  }
  public checkConfirmPassword1() {
    if(this.updatePasswordForm.controls.confirm_password.value === this.updatePasswordForm.controls.new_password.value){
      return true;
    }
    else{
      return false;
    }
    // return this.updatePasswordForm.controls.password.value === this.updatePasswordForm.controls.confirm_password.value;
  }
  public checkValidAccount(){

    if (this.updatePasswordForm.controls.old_password.value === ''){
      this.error.old_password = 'null';
    }
    else  if(!this.checkConfirmPassword()){
      this.error.old_password = 'notmatch';
    }

    else this.error.old_password = '';


    if (this.updatePasswordForm.controls.confirm_password.value === ''){
      this.error.confirm_password = 'null';
    }
    else  if(!this.checkConfirmPassword1()){
      this.error.confirm_password = 'notmatch';
    }

    else this.error.confirm_password = '';

    if (this.updatePasswordForm.controls.new_password.value === ''){
      this.error.new_password = 'null';
    }
    else  if(this.updatePasswordForm.controls.new_password.value.length < 5){
      this.error.new_password = 'min';
    }
    else  if(this.updatePasswordForm.controls.new_password.value.length > 15){
      this.error.new_password = 'max';
    }
    else this.error.new_password = '';


  }
  public success(){
    this.snotify.info(`Tài khoản đã được cập nhật password thành công`, "Xác nhận", {
      position: SnotifyPosition.rightTop,
      timeout: 3000,
      showProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
    });
  }

  public failed(){
    this.snotify.error(`Cập nhật password thất bại`, "Xác nhận", {
      position: SnotifyPosition.rightTop,
      timeout: 3000,
      showProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
    });
  }
}
