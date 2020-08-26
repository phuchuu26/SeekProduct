import { Component, OnInit } from "@angular/core";
import { ServerHttpService } from "src/app/Services/server-http.service";
import { profileUser } from "src/app/models/user";
import Swal from 'sweetalert2';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from "@angular/forms";
import { emailValidator } from "src/app/custom-validation/CustomValidators";
import { SnotifyService, SnotifyPosition } from "ng-snotify";

@Component({
  selector: "app-user-profile",
  templateUrl: "./user-profile.component.html",
  styleUrls: ["./user-profile.component.scss"],
})
export class UserProfileComponent implements OnInit {
  public userProfile: profileUser;
  public profileForm: FormGroup;
  public urlImage: string;
  public avt;
  public status : boolean;

  constructor(
    private snotify: SnotifyService,
    private http: ServerHttpService,
   private forms: FormBuilder
  ) {}

  ngOnInit() {
    // this.http.getProfile().subscribe((data:profileUser)=>{
    //   this.userProfile = data;
    //   console.log(this.userProfile);
    // })
    let a;
    a = localStorage.getItem("USER");
    this.userProfile = JSON.parse(a);
    this.status = this.userProfile.show_phone;
    // console.log(this.userProfile);
    this.profileForm = this.forms.group({
      first_name: new FormControl("", [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(10),
      ]),
      last_name: new FormControl("", [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(10),
      ]),
      email: new FormControl(null, [Validators.required, emailValidator()]),
      avatar: new FormControl("", []),
      username: new FormControl(null, [ Validators.required]),
      phone_number: new FormControl(null, [ Validators.required]),
      work_at: new FormControl(null, [ ]),
      job: new FormControl(null, []),
      message: new FormControl(null, []),
      country: new FormControl(null, [Validators.required]),
      stripe_customer_id: new FormControl(null, []),
      city: new FormControl(null, [Validators.required]),
      vat_number: new FormControl(null, []),
      twitter: new FormControl(null, [Validators.required]),
      facebook: new FormControl(null, [Validators.required]),
      google: new FormControl(null, [Validators.required]),
      linkedin: new FormControl(null,[Validators.required]),
      show_phone: new FormControl(this.status)
    });

    if (this.userProfile.avatar == null) {
      this.urlImage = "assets\\img\\1.png";
    } else {
      this.urlImage = this.userProfile.avatar;
    }

    //  this.http.getProfile().subscribe((data)=>{
    //    this.userProfile = data;
    //   });
    this.loadData();
  }

  public changeStatus() {
    this.status = !this.status;
 }

  public save() {
    // first_name: new FormControl("", [
    //   Validators.required,
    //   Validators.minLength(2),
    //   Validators.maxLength(10),
    // ]),
    // last_name: new FormControl("", [
    //   Validators.required,
    //   Validators.minLength(2),
    //   Validators.maxLength(10),
    // ]),
    // email: new FormControl("", [Validators.required, emailValidator()]),
    // avatar: new FormControl("", []),
    // username: new FormControl("", []),
    // phone_number: new FormControl("", []),
    // work_at: new FormControl("", []),
    // job: new FormControl("", []),
    // message: new FormControl("", []),
    // country: new FormControl("", []),
    // stripe_customer_id: new FormControl("", []),
    // city: new FormControl("", []),
    // vat_number: new FormControl("", []),
    // twitter: new FormControl("", []),
    // facebook: new FormControl("", []),
    // google: new FormControl("", []),
    // linkedin: new FormControl(""),
    // show_phone: new FormControl(this.status)
    let  a = this.submit();
    console.log(a);
    const formdata = new FormData();
    formdata.set('first_name',a.first_name);
    formdata.set('last_name',a.last_name);
    formdata.set('email',a.email);
    formdata.set('avatar',a.avatar);
    // formdata.set('username',a.username);
    formdata.set('phone_number',a.phone_number);
    if(this.fileToUpload != null){
      formdata.append('avatar',this.fileToUpload, this.fileToUpload.name);
    } else formdata.append('avatar','');
    formdata.set('work_at',a.work_at);
    formdata.set('job',a.job);
    formdata.set('message',a.message);
    formdata.set('country',a.country);
    formdata.set('city',a.city);
    formdata.set('vat_number',a.vat_number);
    formdata.set('twitter',a.twitter);
    formdata.set('facebook',a.facebook);
    formdata.set('google',a.google);
    formdata.set('linkedin',a.linkedin);
    formdata.set('show_phone',a.show_phone.toString());
    // this.http.post<any>('https://seekproduct-api.misavu.net/api/user/product/?site='+ this.company_site,formdata,{
    //     headers: new HttpHeaders({
    //       Authorization: 'JWT ' + localStorage.getItem('TOKEN'),
    //     })
    //   }).subscribe((data)=> {
    //     console.log(data);
    //     Swal.fire({
    //       position: 'center',
    //       icon: 'success',
    //       title: 'Your Add Product Success',
    //       showConfirmButton: false,
    //       timer: 1500
    //     });
    //     this.clearnData();
    //     this.check = false;
    //   }, err =>{
    //     Swal.fire({
    //       position: 'center',
    //       icon: 'error',
    //       title: 'Your Add Product Fail',
    //       showConfirmButton: false,
    //       timer: 1500
    //     })
    //   });

  // console.log(formdata);

    this.http.updateProfile(formdata).subscribe(
      (response) => {
        console.log(response);
        localStorage.setItem("USER", JSON.stringify(a));

        this.userProfile = a;
        this.loadData();
        this.success();
      },
      (error) => {
        if (error.status == 500) {
          this.failed(
            "Internal Server error",
            "Can the image field may be incorrectly formatted"
          );
          console.log(error);
          console.log("loi 500");
        } else {
          Object.entries(error.error).forEach(([key, value]) => {
            // console.log(`${key}: ${value}`);
            this.failed(key, value);
          });
        }
        // for (const child of error) {
        //   console.log(child);
        // }
        // error.forEach(data=>{
        //   console.log(data);

        // })
      }
    );
  }
  public loadData() {
    for (const controlName in this.profileForm.controls) {
      if (controlName) {
        this.profileForm.controls[controlName].setValue(
          this.userProfile[controlName]
        );
      }
    }
  }
  public submit() {
    const profile1 = {};
    for (const a in this.profileForm.controls) {
      if (a) {
        console.log(this.profileForm.controls[a].value);
        profile1[a] = this.profileForm.controls[a].value;
      }
    }
    return profile1 as profileUser;
  }
  fileToUpload: File = null;
  public onChangeImage(image,files, a) {
    console.log(image);
    console.log(files);
    this.fileToUpload = files.item(0);
    console.log(this.fileToUpload);
    let file = image.target.files;
    // console.log(image1.urlImage);
    let reader = new FileReader();
    reader.readAsDataURL(file[0]);
    reader.onload = (image) => {
      this.urlImage = reader.result as string;
      // console.log(image);
      this.avt = image.target.result;
    };
  }
  public success(){
    this.snotify.info(`Đã cập nhật thành công thông tin cá nhân`, "Xác nhận", {
      position: SnotifyPosition.rightTop,
      timeout: 2000,
      showProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
    });
  }

  public failed(a,b) {
    this.snotify.error(
      `Update profile failed by ${a} ${b}`,
      "Confirm",
      {
        position: SnotifyPosition.rightTop,
        timeout: 3000,
        showProgressBar: true,
        closeOnClick: false,
        pauseOnHover: true,
      }
    );
  }
}
