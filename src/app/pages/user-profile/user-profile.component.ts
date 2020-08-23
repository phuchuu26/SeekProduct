import { Component, OnInit } from "@angular/core";
import { ServerHttpService } from "src/app/Services/server-http.service";
import { profileUser } from "src/app/models/user";
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
      email: new FormControl("", [Validators.required, emailValidator()]),
      avatar: new FormControl("", []),
      username: new FormControl("", []),
      phone_number: new FormControl("", []),
      work_at: new FormControl("", []),
      job: new FormControl("", []),
      message: new FormControl("", []),
      country: new FormControl("", []),
      stripe_customer_id: new FormControl("", []),
      city: new FormControl("", []),
      vat_number: new FormControl("", []),
      twitter: new FormControl("", []),
      facebook: new FormControl("", []),
      google: new FormControl("", []),
      linkedin: new FormControl(""),
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
    this.http.updateProfile(this.submit()).subscribe(
      (response) => {
        console.log(response);
        let a;
        a = localStorage.getItem("USER");
        this.userProfile = JSON.parse(a);
        this.loadData();
        this.success();
      },
      (error) => {
        console.log(error);
        this.failed();
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

  public onChangeImage(image, a) {
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

  public failed() {
    this.snotify.error(
      `Không thể cập nhật thông tin cá nhân`,
      "Xác nhận",
      {
        position: SnotifyPosition.rightTop,
        timeout: 2000,
        showProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
      }
    );
  }
}
