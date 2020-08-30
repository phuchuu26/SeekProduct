import { Company, Category } from "src/app/models/user";
import { SnotifyService, SnotifyPosition } from "ng-snotify";
import { ServerHttpService } from "src/app/Services/server-http.service";
import { Router, ActivatedRoute } from "@angular/router";
import { Observable } from "rxjs";
import { startWith, map } from "rxjs/operators";

import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
  FormArray,
} from "@angular/forms";
import {
  Component,
  OnInit,
  OnChanges,
  DoCheck,
  AfterViewChecked,
} from "@angular/core";
import Swal from "sweetalert2";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: "app-create-company",
  templateUrl: "./create-company.component.html",
  styleUrls: ["./create-company.component.css"],
})
export class CreateCompanyComponent implements OnInit, DoCheck {
  // options: string[] = ['One', 'Two', 'Three'];
  // myControl = new FormControl();
  // filteredOptions: Observable<string[]>;
  toppings = new FormControl();
  category = new FormControl();
  public companyForm: FormGroup;
  // public companyProfile: Company;
  public site: string;
  public urlImage: string;
  public urlImageBanner: string[] = [];
  public urlImageAdSample: string;
  public avt;
  // public category: Category[];
  public toppingList: Category[];
  public toggleAddCategory: boolean = false;
  public nameca: string;
  public cateChoosed: string[] = [];
  constructor(
    private snotify: SnotifyService,
    private http: ServerHttpService,
    private forms: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) {}
  // private _filter(value: string): string[] {
  //   const filterValue = value.toLowerCase();

  //   return this.options.filter(option => option.toLowerCase().includes(filterValue));
  // }
  public nameCa() {
    this.cateChoosed = [];
    if (this.toppingList) {
      if (this.category.value != null) {
        this.category.value.forEach((item1) => {
          this.toppingList.forEach((item) => {
            if (item.id == item1) {
              this.cateChoosed.push(item.name);
              // console.log(this.cateChoosed);
            }
          });
        });
      }
    }
    // console.log(this.cateChoosed);
  }

  ngDoCheck(): void {
    this.checkValidAccount();
    if (this.toppingList) {
      if (this.category.value != null) {
        for (let option of this.toppingList) {
          if (option.id == this.category.value[0]) {
            this.nameca = option.name;
            // console.log(this.nameca);
          }
        }
      }
    }
  }
  ngOnInit(): void {
    // this.filteredOptions = this.myControl.valueChanges
    //   .pipe(
    //     startWith(''),
    //     map(value => this._filter(value))
    //   );

    this.companyForm = this.forms.group({
      store_name: new FormControl("", [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(20),
      ]),
      address: new FormControl("", [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(30),
      ]),
      phone_number: new FormControl("", [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(11),
        this.checkNumber,
      ]),
      legal_name: new FormControl("", [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(30),
      ]),
      site: new FormControl("", [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(20),
      ]),
      business_license: new FormControl('', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(14),
      ]),
      logo: new FormControl("", [Validators.required]),
      ad_sample: new FormControl("", [Validators.required]),
      about: new FormControl("", [
        Validators.required,
        Validators.minLength(5),
      ]),
      banner: this.forms.array([this.forms.control("")]),
      category: this.forms.array,
    });
    this.urlImage = "assets\\img\\1.png";

    this.urlImageAdSample = "https://www.osustuff.org/images/placeholder.png";
    this.urlImageBanner[0] = "https://www.osustuff.org/images/placeholder.png";

    this.http.getAllCategory().subscribe((data) => {
      console.log(data);
      this.toppingList = data.results;
    });

    // this.loadData();
  }

  public submit() {
    const companyProfile = {};
    for (const a in this.companyForm.controls) {
      if (a) {
        // console.log(this.companyForm.controls[a].value);
        companyProfile[a] = this.companyForm.controls[a].value;
      }
    }
    // let a = this.companyForm.get("ad_sample").value;
    // const formData: FormData = new FormData();
    // console.log(a);
    // formData.append('ad_simple',a);
    // console.log(formData);
    //  companyProfile.ad_sample = this.urlImageAdSample;
    return companyProfile as Company;
  }
  fileToUpload: File = null;
  public onChangeImage(image, files, a) {
    this.fileToUpload = files.item(0);
    let file = image.target.files;
    // console.log(image1.urlImage);
    let reader = new FileReader();
    reader.readAsDataURL(file[0]);
    reader.onload = (image) => {
      this.urlImage = reader.result as string;
      // console.log(image);
      // this.avt = image.target.result;
      // console.log(image);
      // console.log(a);
      // console.log(reader);
    };
  }
  public onChangeImage1(image, i) {
    let file = image.target.files;
    // console.log(image);
    // console.log(i);
    let reader = new FileReader();
    reader.readAsDataURL(file[0]);
    reader.onload = (image) => {
      this.urlImageBanner[0] = reader.result as string;
      // console.log(image);
      // this.avt = image.target.result;
    };
  }
  fileToUpload1: File = null;
  public onChangeAdSample(image, a, i) {
    this.fileToUpload1 = a.item(0);
    let file = image.target.files;
    // console.log(image);
    // console.log(i);
    console.log(image);
    this.avt = file[0].name;
    let reader = new FileReader();
    reader.readAsDataURL(file[0]);
    reader.onload = (image) => {
      this.urlImageAdSample = reader.result as string;
      // console.log(image);
      // this.avt = image.target.result;
      // console.log(this.avt);
    };
  }

  public buttonToggleAddCategory() {
    this.toggleAddCategory = !this.toggleAddCategory;
  }
  public a: number = 0;
  public addbanner(i) {
    this.urlImageBanner[i + 1] =
      "https://www.osustuff.org/images/placeholder.png";
    this.bannerList.push(this.forms.control(""));
    this.a++;
    // console.log(i);
    // console.log(this.urlImageBanner);
  }
  public aa = [];
  public onChangeBanner(image, i: number, e, a) {
    var fileToUploadBanner: File = null;
    fileToUploadBanner = e.item(0);
    this.aa.push(fileToUploadBanner);

    let file = image.target.files;
    let reader = new FileReader();
    reader.readAsDataURL(file[0]);
    reader.onload = (image) => {
      this.urlImageBanner[i] = reader.result as string;
    };
  }

  get bannerList() {
    return this.companyForm.get("banner") as FormArray;
  }
  get categoryList() {
    return this.companyForm.get("category") as FormArray;
  }
  public addBanner(): void {
    this.bannerList.push(this.forms.control(""));
  }

  public save() {
    this.companyForm.controls.category.setValue(this.category.value);
    let a = this.submit();
    console.log(a.category);
    // phone_number: new FormControl(),
    // legal_name: new FormControl(),
    // site: new FormControl(),
    // business_license: new FormControl(),
    // logo: new FormControl("", []),
    // ad_sample: new FormControl(null,[]),
    // about: new FormControl(),
    // banner: this.forms.array([this.forms.control("")]),
    // category: this.forms.array,

    const formdata = new FormData();
    formdata.set("store_name", a.store_name);
    formdata.set("address", a.address);
    formdata.set("phone_number", a.phone_number);
    formdata.set("legal_name", a.phone_number);
    formdata.set("site", a.site);
    formdata.set("business_license", a.business_license);
    if (this.fileToUpload != null) {
      formdata.append("logo", this.fileToUpload, this.fileToUpload.name);
    } else formdata.append("logo", "");
    if (this.fileToUpload1 != null) {
      formdata.append("ad_sample", this.fileToUpload1, this.fileToUpload1.name);
    } else formdata.append("ad_sample", "");
    formdata.set("about", a.about);
    if (a.category != null) {
      a.category.forEach((value, i) => {
        if (a.category[i] != null) {
          formdata.append("category", a.category[i].toString());
        } else formdata.append("category", "");
      });
    }
    a.banner.forEach((value, i) => {
      if (this.aa[i] != null) {
        formdata.append("banner", this.aa[i], this.aa[i].name);
      } else formdata.append("banner", "");
    });

    // formdata.set('category',a.category.toString());

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

        this.spinner.show();
        this.http.createCompany(formdata).subscribe(
      (data) => {
        console.log(data);
        // this.router.navigate(["login"]);
        this.success(this.companyForm.controls.store_name.value);
          this.spinner.hide();
          this.router.navigate(["allmycompany"]);
        },
        (error) => {
          this.spinner.hide();
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
    //  console.log(typeof this.companyForm.controls.category.value);
    //  console.log(this.companyForm.controls.category.value);
    //  console.log(this.category);
    //  console.log(typeof this.companyForm.controls.banner.value);
    //  console.log(this.companyForm.controls.banner.value);
  }
  public success(a) {
    this.snotify.info(`Company ${a} has been created successfully`, "Confirm", {
      position: SnotifyPosition.rightTop,
      timeout: 3000,
      showProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
    });
  }

  public failed(a, b) {
    this.snotify.error(`Create company failed by ${a} ${b}`, "Confirm", {
      position: SnotifyPosition.rightTop,
      timeout: 4000,
      showProgressBar: true,
      closeOnClick: false,
      pauseOnHover: true,
    });
  }

  public checkNumber(control) {
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
          console.log(n);
          if (isNaN(so) && (n != "+" || isNaN(m))) {
            return { error: "Passwords do not match" };
          } else {
            return null;
          }
        }
      }
    }
  }
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
          console.log(n);
          console.log(typeof so);
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

      }

      else this.error.phone_number = "";

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
}
