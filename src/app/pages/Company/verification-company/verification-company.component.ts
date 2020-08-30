import { Component, OnInit, DoCheck } from "@angular/core";
import { SnotifyService, SnotifyPosition } from "ng-snotify";
import { ServerHttpService } from "src/app/Services/server-http.service";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { Company, VerificationCompany } from "src/app/models/user";
import { NgbDateStruct } from "@ng-bootstrap/ng-bootstrap/datepicker/datepicker.module";

@Component({
  selector: "app-verification-company",
  templateUrl: "./verification-company.component.html",
  styleUrls: ["./verification-company.component.css"],
})
export class VerificationCompanyComponent implements OnInit, DoCheck {
  public companyProfile: Company;
  site: string;
  btok: string;
  public companyForm: FormGroup;
  public urlImage: string;
  date: NgbDateStruct= { day: 1, month: 9, year: 2020 };
  // date: {year: number, month: number};
  constructor(
    private snotify: SnotifyService,
    private http: ServerHttpService,
    private forms: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) {}

  ngDoCheck() {
    this.checkValidAccount();
  }
  ngOnInit(): void {

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
    this.urlImage = "assets\\img\\1.png";
    this.companyForm = this.forms.group({
      city: new FormControl("", [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(20),
      ]),
      line1: new FormControl("", [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(20),
      ]),
      postal_code: new FormControl("", [
        Validators.required,
        Validators.min(1000),
        Validators.max(9999),
      ]),
      state: new FormControl("", [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(20),
      ]),
      bussiness_name: new FormControl("", [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(20),
      ]),
      bussiness_tax_id: new FormControl("", [
        Validators.required,
        Validators.min(10000000),
        Validators.max(99999999),
      ]),

      first_name: new FormControl("", [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(20),
      ]),
      last_name: new FormControl("", [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(20),
      ]),
      logo: new FormControl("", []),
    });
  }

  logo: File = null;
  public onChangeImage(image, files, a) {
    this.logo = files.item(0);
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

  public error = {
    city: "",
    line1: "",
    postal_code: "",
    state: "",
    bussiness_name: "",
    bussiness_tax_id: "",
    first_name: "",
    last_name: "",
    logo: "",
    date: "",
  };

  public checkValidAccount() {
    if (this.companyForm.controls.logo.value === "") {
      this.error.logo = "null";
    } else this.error.logo = "";

    if (this.date.year.toString() == '2020') {
      this.error.date = "null";
    } else this.error.date = "";

    if (this.companyForm.controls.city.value === "") {
      this.error.city = "null";
    } else if (this.companyForm.controls.city.value.length < 2) {
      this.error.city = "min";
    } else if (this.companyForm.controls.city.value.length > 20) {
      this.error.city = "max";
    } else this.error.city = "";

    if (this.companyForm.controls.line1.value === "") {
      this.error.line1 = "null";
    } else if (this.companyForm.controls.line1.value.length < 2) {
      this.error.line1 = "min";
    } else if (this.companyForm.controls.line1.value.length > 20) {
      this.error.line1 = "max";
    } else this.error.line1 = "";

    if (this.companyForm.controls.postal_code.value.toString() === "") {
      this.error.postal_code = "null";
    } else if (
      this.companyForm.controls.postal_code.value.toString().length < 4
    ) {
      this.error.postal_code = "min";
    } else if (
      this.companyForm.controls.postal_code.value.toString().length > 4
    ) {
      this.error.postal_code = "max";
    } else this.error.postal_code = "";

    if (this.companyForm.controls.state.value == "") {
      this.error.state = "null";
    } else if (this.companyForm.controls.state.value.length < 2) {
      this.error.state = "min";
    } else if (this.companyForm.controls.state.value.length > 20) {
      this.error.state = "max";
    } else this.error.state = "";

    if (this.companyForm.controls.bussiness_name.value === "") {
      this.error.bussiness_name = "null";
    } else if (this.companyForm.controls.bussiness_name.value.length < 2) {
      this.error.bussiness_name = "min";
    } else if (this.companyForm.controls.bussiness_name.value.length > 20) {
      this.error.bussiness_name = "max";
    } else this.error.bussiness_name = "";

    if (this.companyForm.controls.bussiness_tax_id.value.toString() === "") {
      this.error.bussiness_tax_id = "null";
    } else if (
      this.companyForm.controls.bussiness_tax_id.value.toString().length < 8
    ) {
      this.error.bussiness_tax_id = "min";
    } else if (
      this.companyForm.controls.bussiness_tax_id.value.toString().length > 8
    ) {
      this.error.bussiness_tax_id = "max";
    } else this.error.bussiness_tax_id = "";

    if (this.companyForm.controls.first_name.value === "") {
      this.error.first_name = "null";
    } else if (this.companyForm.controls.first_name.value.length < 2) {
      this.error.first_name = "min";
    } else if (this.companyForm.controls.first_name.value.length > 20) {
      this.error.first_name = "max";
    } else this.error.first_name = "";

    if (this.companyForm.controls.last_name.value === "") {
      this.error.last_name = "null";
    } else if (this.companyForm.controls.last_name.value.length < 2) {
      this.error.last_name = "min";
    } else if (this.companyForm.controls.last_name.value.length > 20) {
      this.error.last_name = "max";
    } else this.error.last_name = "";
  }

  public submit() {
    let companyProfile = {};
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
    return companyProfile as VerificationCompany;
  }
  save() {
    this.http.getBtok().subscribe();
    this.spinner.show();
    const bank = localStorage.getItem("BTOK");
    console.log(this.submit());
    console.log(this.date.year);
    let a = this.submit();
    const formdata = new FormData();
    formdata.set("company_id", this.companyProfile.id.toString());

    formdata.set("city", a.city);
    formdata.set("line1", a.line1);
    formdata.set("postal_code", a.postal_code+'');
    formdata.set("state", a.state);
    formdata.set("bussiness_name", a.bussiness_name);
    formdata.set("bussiness_tax_id", a.bussiness_tax_id.toString());
    formdata.set("first_name", a.first_name);
    formdata.set("last_name", a.last_name);
    formdata.set("bank_token", bank);
    formdata.set("dob_day", this.date.month.toString());
    formdata.set("dob_month", this.date.month.toString());
    formdata.set("dob_year", this.date.year.toString());
    if (this.logo != null) {
      formdata.append("photo_id_front", this.logo, this.logo.name);
    } else formdata.append("photo_id_front", "");


    this.http.VerificationCompany(formdata).subscribe( async(data) => {
      this.success(this.companyProfile.store_name);
      await this.router.navigate(["allmycompany"]);
      await setTimeout(() => {
        this.router.navigate(["detailcompany", this.companyProfile.site]);
      }, 600);
      this.spinner.hide();
    }
    , (error)=>{
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
    })
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
}
