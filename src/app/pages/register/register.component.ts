import { SnotifyService, SnotifyPosition } from 'ng-snotify';
import { Component, OnInit, DoCheck, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { registerAccount } from 'src/app/models/user';
import { ServerHttpService } from 'src/app/Services/server-http.service';
import { emailValidator, confirmPasswordValidator1, MatchPassword, MustMatch} from 'src/app/custom-validation/CustomValidators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit,DoCheck {
  public error = {first_name : '', last_name: '', email: '', password: '',confirm_password: ''};

  accountForm: FormGroup;
  constructor(
    private http: ServerHttpService,
    private formBuilder: FormBuilder,
    private snotify: SnotifyService,
    private router: Router
  ) {

  }


  ngOnInit(  ) {
    this.accountForm = this.formBuilder.group({
      first_name: new FormControl("", [Validators.required, Validators.minLength(2),Validators.maxLength(10)]),
      last_name: new FormControl("", [Validators.required, Validators.minLength(2),Validators.maxLength(10)]),
      email: new FormControl("", [Validators.required, emailValidator() ]),
      password: new FormControl("", [Validators.required,Validators.minLength(5),Validators.maxLength(10) ]),
      confirm_password: new FormControl("", [Validators.required , this.passwordCheck])
    },
    )
  }

  ngDoCheck() {
    this.checkValidAccount();
  }

  public passwordCheck(control){
    // console.log(control);
    if(control.value != null){
      var conPass = control.value;
      var pass = control.root.get('password');
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

  public save(){
    this.http.register(this.submit()).subscribe((data)=>{

      console.log(data);
      this.router.navigate(["login"]);
      this.success(this.accountForm.controls.first_name.value);
    }, (error)=>{
      this.failed();
    })

  }
  public submit(){
    const account = {};
    for( const a in this.accountForm.controls){
      if(a){
        console.log(this.accountForm.controls[a].value);
        account[a] = this.accountForm.controls[a].value;
      }
    }
    return account as registerAccount;
  }
  public checkValidAccount(){
    let filter = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (this.accountForm.controls.first_name.value === ''){
      this.error.first_name = 'null';
    }
    else  if(this.accountForm.controls.first_name.value.length < 2){
      this.error.first_name = 'min';
    }
    else  if(this.accountForm.controls.first_name.value.length > 10){
      this.error.first_name = 'max';
    }
    else this.error.first_name = '';



    if (this.accountForm.controls.last_name.value === ''){
      this.error.last_name = 'null';
    }
    else  if(this.accountForm.controls.last_name.value.length < 2){
      this.error.last_name = 'min';
    }
    else  if(this.accountForm.controls.last_name.value.length > 10){
      this.error.last_name = 'max';
    }
    else this.error.last_name = '';



    if (this.accountForm.controls.email.value === ''){
      this.error.email = 'null';
    }

    else  if(!filter.test(this.accountForm.controls.email.value)){
      this.error.email = 'notEmail';
    }
    else this.error.email = '';


    if (this.accountForm.controls.password.value === ''){
      this.error.password = 'null';
    }
    else  if(this.accountForm.controls.password.value.length < 5){
      this.error.password = 'min';
    }
    else  if(this.accountForm.controls.password.value.length > 15){
      this.error.password = 'max';
    }
    else this.error.password = '';

    if (this.accountForm.controls.confirm_password.value === ''){
      this.error.confirm_password = 'null';
    }
     else if(!this.checkConfirmPassword()){
      this.error.confirm_password = 'notMatch';
    }
    else this.error.confirm_password = '';

  }
  public success(a){
    this.snotify.info(`Tài khoản ${a} đã được tạo thành công`, "Xác nhận", {
      position: SnotifyPosition.rightTop,
      timeout: 3000,
      showProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
    });
  }

  public failed(){
    this.snotify.error(`Tạo tài khoản thất bại do bị trùng tài khoản email`, "Xác nhận", {
      position: SnotifyPosition.rightTop,
      timeout: 3000,
      showProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
    });
  }
  public checkConfirmPassword() {
    if(this.accountForm.controls.password.value === this.accountForm.controls.confirm_password.value){
      return true;
    }
    else{
      return false;
    }
    return this.accountForm.controls.password.value === this.accountForm.controls.confirm_password.value;
  }
}
