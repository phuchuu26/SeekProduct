import {
  Component,
  OnInit,
  DoCheck,
  Inject,
  ViewChild,
  ElementRef,
} from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from "@angular/forms";
import { Company, Category } from "src/app/models/user";
import { SnotifyService, SnotifyPosition } from "ng-snotify";
import { ServerHttpService } from "src/app/Services/server-http.service";
import { Router, ActivatedRoute } from "@angular/router";
import { Observable } from "rxjs";
import { startWith, map } from "rxjs/operators";
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from "@angular/material/dialog";
import {
  DialogData,
  DialogOverviewExampleDialog,
} from "../../manage-product/manage-product.component";

@Component({
  selector: "app-detail-company",
  templateUrl: "./detail-company.component.html",
  styleUrls: ["./detail-company.component.css"],
})
export class DetailCompanyComponent implements DoCheck, OnInit {
  // options: string[] = ['One', 'Two', 'Three'];
  // myControl = new FormControl();
  // filteredOptions: Observable<string[]>;
  public cateChoosed: string[] = [];
  category1 = new FormControl();
  public nameca: string;
  toppings = new FormControl();
  public companyForm: FormGroup;
  public companyProfile: Company;
  public site: string;
  public urlImage: string;
  public urlImageBanner: string[] = [];
  public urlImageAdSample: string;
  public avt;
  public category: Category[];
  public toppingList: Category[];
  public toggleAddCategory: boolean = false;
  constructor(
    public dialog: MatDialog,
    private snotify: SnotifyService,
    private http: ServerHttpService,
    private forms: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  // private _filter(value: string): string[] {
  //   const filterValue = value.toLowerCase();

  //   return this.options.filter(option => option.toLowerCase().includes(filterValue));
  // }

  ngOnInit(): void {
    // this.nameCa();
    // this.filteredOptions = this.myControl.valueChanges
    //   .pipe(
    //     startWith(''),
    //     map(value => this._filter(value))
    //   );

    this.site = this.route.snapshot.paramMap.get("id");
    //get detail by  localStore:
    let com, compa, index;
    com = localStorage.getItem("ALLCOMPANY");
    compa = JSON.parse(com);
    com = compa;
    // console.log(com);
    if (this.site) {
      function findIndexByKeyValue(com, site, value) {
        for (var index = 0; index < com.length; index++) {
          if (com[index][site] === value) {
            return index;
          }
        }
        return -1;
      }
      index = findIndexByKeyValue(com, "site", this.site);
      console.log(index);
      console.log(com[index]);
      this.companyProfile = com[index];
    }

    //get detail by API
    this.http.detailCompany(this.site).subscribe((data) => {
      // this.companyProfile = data;
      // console.log(data);
      // console.log(this.companyProfile);
      this.http.getCategory(data.site).subscribe((data1) => {
        this.category = data1;

        data1.forEach((res) => {
          this.category1.value = this.companyProfile.category;
        });
      });
    });

    if (this.category) {
      this.toppingList = this.category;
    }

    // console.log(index);
    // if (this.userProfile.avatar == null) {
    //   this.urlImage = "assets\\img\\1.png";
    // } else {
    //   this.urlImage = this.userProfile.avatar;
    // }

    this.companyForm = this.forms.group({
      // id: new FormControl(),
      // user: new FormControl(),
      store_name: new FormControl(),
      facebook: new FormControl(),
      twitter: new FormControl(),
      instagram: new FormControl(),
      address: new FormControl(),
      phone_number: new FormControl(),
      legal_name: new FormControl(),
      site: new FormControl(),
      logo: new FormControl(null, []),
      business_license: new FormControl(),
      ad_sample: new FormControl(null, []),
      about: new FormControl(),
      // banner: this.forms.array([this.forms.control("")]),
      category: this.forms.array,
    });
    if (this.companyProfile.logo == null) {
      this.urlImage = "assets\\img\\1.png";
    } else {
      this.urlImage = this.companyProfile.logo;
    }

    if (this.companyProfile.ad_sample == null) {
      this.urlImageAdSample = "assets\\img\\1.png";
    } else {
      this.urlImageAdSample = this.companyProfile.ad_sample;
    }

    if (this.companyProfile.banner == null) {
      // this.urlImageBanner[0] = "https://picsum.photos/id/1011/900/500";
    } else {
      for (let ban of this.companyProfile.banner) {
        this.urlImageBanner.push(ban);
      }
      // this.urlImageBanner = this.companyProfile.banner;
    }
    console.log(this.urlImageBanner);

    this.http.getAllCategory().subscribe((data) => {
      // console.log(data);
      this.toppingList = data.results;
    });

    this.loadData();
  }
  ngDoCheck(): void {
    this.nameCa();
    this.checkValidAccount();
    if (this.toppingList) {
      if (this.category1.value != null) {
        for (let option of this.toppingList) {
          if (option.id == this.category1.value[0]) {
            this.nameca = option.name;
            // console.log(this.nameca);
          }
        }
      }
    }
  }
  pass(site) {
    this.router.navigate(["editBanner", site]);
  }
  public loadData() {
    console.log(this.companyProfile.category);
    // this.category1.setValue(this.companyProfile.category);
    // this.companyProfile.category.forEach((data) => {
    // this.category1.value = [2,23,2];
    // })
    if (this.companyProfile) {
      for (const controlName in this.companyForm.controls) {
        if (controlName) {
          this.companyForm.controls[controlName].setValue(
            this.companyProfile[controlName]
          );
        }
      }
    }
    this.companyForm.controls.facebook.setValue(this.companyProfile.social_link.facebook);
    this.companyForm.controls.twitter.setValue(this.companyProfile.social_link.twitter);
    this.companyForm.controls.instagram.setValue(this.companyProfile.social_link.instagram);
  }

  public nameCa() {
    this.cateChoosed = [];
    if (this.toppingList) {
      if (this.category1.value != null) {
        this.category1.value.forEach((item1) => {
          this.toppingList.forEach((item) => {
            if (item.id == item1) {
              this.cateChoosed.push(item.name);
              // console.log(this.cateChoosed);
            }
          });
        });
      }
    }
    // console.log(this.category1);
    // console.log(this.cateChoosed);
    // console.log(this.cateChoosed);
  }
  logo: File = null;

  public onChangeImage(image, a, i) {
    this.logo = a.item(0);
    let file = image.target.files;
    // console.log(image1.urlImage);
    let reader = new FileReader();
    reader.readAsDataURL(file[0]);
    reader.onload = (image) => {
      this.urlImage = reader.result as string;
      // console.log(image);
      this.avt = image.target.result;
      // console.log(image);
      // console.log(a);
      // console.log(reader);
    };
  }
  // public onChangeImage1(image, a) {
  //   let file = image.target.files;
  //   // console.log(image1.urlImage);
  //   let reader = new FileReader();
  //   reader.readAsDataURL(file[0]);
  //   reader.onload = (image) => {
  //     // this.urlImageBanner = reader.result as string;
  //     // console.log(image);
  //     // this.avt = image.target.result;
  //   };
  // }
  adSample: File = null;
  public onChangeAdSample(image, a, i) {
    this.adSample = a.item(0);
    let file = image.target.files;
    // console.log(image1.urlImage);
    let reader = new FileReader();
    reader.readAsDataURL(file[0]);
    reader.onload = (image) => {
      this.urlImageAdSample = reader.result as string;
      // console.log(image);
      // this.avt = image.target.result;
    };
  }

  public submit() {
    const profile1 = {};
    for (const a in this.companyForm.controls) {
      if (a) {
        console.log(this.companyForm.controls[a].value);
        profile1[a] = this.companyForm.controls[a].value;
      }
    }
    return profile1 as Company;
  }
  public save() {
    // console.log(this.companyForm);
    // console.log(this.companyProfile);
    // console.log(this.submit());
    this.companyForm.controls.category.setValue(this.category1.value);
    let a = this.submit();

  let  test = {
    facebook: this.companyForm.controls.facebook.value,
    instagram: this.companyForm.controls.instagram.value,
    twitter: this.companyForm.controls.twitter.value,
    };
    console.log(this.companyForm.controls.facebook.value);
    const formdata1 = new FormData();
    formdata1.set("facebook", this.companyForm.controls.facebook.value);
    formdata1.set("instagram", this.companyForm.controls.instagram.value);
    formdata1.set("twitter", this.companyForm.controls.twitter.value);
    this.http.addSocialLink(this.companyProfile.id, test).subscribe((data) => {
      console.log(data);
    },
    (error)=>{
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
    })

    const formdata = new FormData();
    formdata.set("store_name", a.store_name);
    formdata.set("address", a.address);
    formdata.set("phone_number", a.phone_number);
    formdata.set("legal_name", a.phone_number);
    formdata.set("site", a.site);
    formdata.set("business_license", a.business_license);
    if (this.logo != null) {
      formdata.append("logo", this.logo, this.logo.name);
    } else formdata.append("logo", "");
    if (this.adSample != null) {
      formdata.append("ad_sample", this.adSample, this.adSample.name);
    } else formdata.append("ad_sample", "");
    formdata.set("about", a.about);
    if (a.category != null) {
      a.category.forEach((value, i) => {
        if (a.category[i] != null) {
          formdata.append("category", a.category[i].toString());
        } else formdata.append("category", "");
      });
    }

    this.http.updateCompany(this.companyProfile.site, formdata).subscribe(
      (data) => {
        console.log(data);
        // this.router.navigate(["login"]);
        this.success(a.store_name);
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
      }
    );
  }

  public buttonToggleAddCategory() {
    this.toggleAddCategory = !this.toggleAddCategory;
  }

  public error = {
    store_name: "",
    address: "",
    phone_number: "",
    legal_name: "",
    site: "",
    logo: "",
    business_license: "",
    ad_sample: "",
    about: "",
    banner: "",
    category: "",
  };
  public checkNumber1(control) {
    // console.log(control);
    if (control.value != null) {
      var so = control.value;
      // console.log(so);
      // var pass = control.root.get('password');
      if (so) {
        // var password = pass.value;
        if (so !== "") {
          let n = so.charAt(0);
          let m = so.slice(1, so.length);
          // console.log(n);
          // console.log(typeof so);
          if (isNaN(so)) {
            return false;
          } else if (n != "+" && isNaN(m) && so.length <= 11 && so.length > 9) {
            return false;
          } else if (so.length <= 11 && so.length > 9) {
            return false;
          } else {
            return true;
          }
        }
      }
    }
  }
  public checkValidAccount() {
    if (this.companyForm.controls.store_name.value === "") {
      this.error.store_name = "null";
    } else if (this.companyForm.controls.store_name.value.length < 2) {
      this.error.store_name = "min";
    } else if (this.companyForm.controls.store_name.value.length > 20) {
      this.error.store_name = "max";
    } else this.error.store_name = "";

    if (this.companyForm.controls.address.value === "") {
      this.error.address = "null";
    } else if (this.companyForm.controls.address.value.length < 2) {
      this.error.address = "min";
    } else if (this.companyForm.controls.address.value.length > 20) {
      this.error.address = "max";
    } else this.error.address = "";

    if (this.companyForm.controls.site.value === "") {
      this.error.site = "null";
    } else if (this.companyForm.controls.site.value.length < 2) {
      this.error.site = "min";
    } else if (this.companyForm.controls.site.value.length > 15) {
      this.error.site = "max";
    } else this.error.site = "";

    // console.log(this.companyForm.controls.phone_number.value)
    // console.log(this.checkNumber1(this.companyForm.controls.phone_number));

    if (this.companyForm.controls.phone_number.value === "") {
      this.error.phone_number = "null";
    } else if (this.checkNumber1(this.companyForm.controls.phone_number)) {
      this.error.phone_number = "notphone";
    } else this.error.phone_number = "";

    if (this.companyForm.controls.legal_name.value === "") {
      this.error.legal_name = "null";
    } else if (this.companyForm.controls.legal_name.value.length < 2) {
      this.error.legal_name = "min";
    } else if (this.companyForm.controls.legal_name.value.length > 20) {
      this.error.legal_name = "max";
    } else this.error.legal_name = "";

    if (this.companyForm.controls.business_license.value === "") {
      this.error.business_license = "null";
    } else if (this.companyForm.controls.business_license.value.length < 10) {
      this.error.business_license = "min";
    } else if (this.companyForm.controls.business_license.value.length > 14) {
      this.error.business_license = "max";
    } else this.error.business_license = "";

    // console.log(this.companyForm.controls.category.value.length);
    // console.log(this.companyForm.controls.category.value);
    // console.log(this.cateChoosed);
    // console.log(this.cateChoosed.length);
    if (this.cateChoosed.length === 0) {
      this.error.category = "min";
    } else this.error.category = "";

    if (this.companyForm.controls.about.value === "") {
      this.error.about = "null";
    } else if (this.companyForm.controls.about.value.length < 5) {
      this.error.about = "min";
    } else this.error.about = "";

    if (this.companyForm.controls.address.value === "") {
      this.error.address = "null";
    } else if (this.companyForm.controls.address.value.length < 5) {
      this.error.address = "min";
    } else if (this.companyForm.controls.address.value.length > 30) {
      this.error.address = "max";
    } else this.error.address = "";

    if (this.companyForm.controls.ad_sample.value === "") {
      this.error.ad_sample = "null";
      this.error.ad_sample = "null";
    } else this.error.ad_sample = "";

    if (this.companyForm.controls.logo.value == "") {
      this.error.logo = "null";
    } else this.error.logo = "";
  }

  public success(a) {
    this.snotify.info(`Company ${a} has been updated successfully`, "Confirm", {
      position: SnotifyPosition.rightTop,
      timeout: 3000,
      showProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
    });
  }

  public failed(a, b) {
    this.snotify.error(`Updated company failed by ${a} ${b}`, "Confirm", {
      position: SnotifyPosition.rightTop,
      timeout: 4000,
      showProgressBar: true,
      closeOnClick: false,
      pauseOnHover: true,
    });
  }
  save1() {}
}
