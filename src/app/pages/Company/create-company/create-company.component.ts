import { Company, Category } from "src/app/models/user";
import { SnotifyService } from "ng-snotify";
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
import { Component, OnInit, OnChanges } from "@angular/core";

@Component({
  selector: "app-create-company",
  templateUrl: "./create-company.component.html",
  styleUrls: ["./create-company.component.css"],
})
export class CreateCompanyComponent implements OnInit, OnChanges {
  // options: string[] = ['One', 'Two', 'Three'];
  // myControl = new FormControl();
  // filteredOptions: Observable<string[]>;
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
  ngOnChanges(): void {

  }
  ngOnInit(): void {
    // this.filteredOptions = this.myControl.valueChanges
    //   .pipe(
    //     startWith(''),
    //     map(value => this._filter(value))
    //   );

    this.companyForm = this.forms.group({
      store_name: new FormControl(),
      address: new FormControl(),
      phone_number: new FormControl(),
      legal_name: new FormControl(),
      site: new FormControl(),
      business_license: new FormControl(),
      logo: new FormControl("", []),
      ad_sample: new FormControl(),
      about: new FormControl(),
      banner: this.forms.array([this.forms.control("")]),
      category: new FormControl(),
    });
    this.urlImage = "assets\\img\\1.png";

    this.urlImageAdSample = "https://www.osustuff.org/images/placeholder.png";
    this.urlImageBanner[0] = "https://www.osustuff.org/images/placeholder.png";

    this.http.getAllCategory().subscribe((data) => {
      console.log(data);
      this.toppingList = data.results;
    });

    this.loadData();
  }

  public loadData() {
    if (this.companyProfile) {
      for (const controlName in this.companyForm.controls) {
        if (controlName) {
          this.companyForm.controls[controlName].setValue(
            this.companyProfile[controlName]
          );
        }
      }
    }
  }
  public onChangeImage(image, a) {
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
    console.log(image);
    console.log(i);
    let reader = new FileReader();
    reader.readAsDataURL(file[0]);
    reader.onload = (image) => {
      this.urlImageBanner[0] = reader.result as string;
      // console.log(image);
      // this.avt = image.target.result;
    };
  }
  public onChangeAdSample(image, i) {
    let file = image.target.files;
    console.log(image);
    console.log(i);
    console.log(file);
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
    this.urlImageBanner[i+1] = "https://www.osustuff.org/images/placeholder.png";
    this.bannerList.push(this.forms.control(""));
    this.a++;
    console.log(i);
    console.log(this.urlImageBanner);
  }
  public onChangeBanner(image, i, a) {
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
  public addBanner(): void {
    this.bannerList.push(this.forms.control(""));
  }

  public save() {
    let num = 0;
    for (let a of this.bannerList.controls) {
      console.log(
        "Banner" +
          (num + 1) +
          "=>" +
          this.companyForm.get(["banner", num]).value
      );
      num++;
    }
    console.log(this.companyForm);
  }
}
