import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from "@angular/forms";
import { Company, Category } from "src/app/models/user";
import { SnotifyService } from "ng-snotify";
import { ServerHttpService } from "src/app/Services/server-http.service";
import { Router, ActivatedRoute } from "@angular/router";
import { Observable } from "rxjs";
import { startWith, map } from "rxjs/operators";

@Component({
  selector: "app-detail-company",
  templateUrl: "./detail-company.component.html",
  styleUrls: ["./detail-company.component.css"],
})
export class DetailCompanyComponent implements OnInit {
  // options: string[] = ['One', 'Two', 'Three'];
  // myControl = new FormControl();
  // filteredOptions: Observable<string[]>;
  toppings = new FormControl();
  public companyForm: FormGroup;
  public companyProfile: Company;
  public site: string;
  public urlImage: string;
  public urlImageBanner: string[]=[];
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
  ngOnInit(): void {
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
    console.log(com);
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
      console.log(data);
      console.log(this.companyProfile);
      this.http.getCategory(data.site).subscribe((data1) => {
        this.category = data1;
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
      address: new FormControl(),
      phone_number: new FormControl(),
      legal_name: new FormControl(),
      site: new FormControl(),
      logo: new FormControl("", []),
      business_license: new FormControl(),
      ad_sample: new FormControl(),
      about: new FormControl(),
      banner: new FormControl(),
      category: new FormControl(),
      // productgroup: {
      //   id: number;
      //   name: string;
      //   info: string;
      //   company: number;
      // }[];
      // social_link: {
      //   facebook: string;
      //   instagram: string;
      //   twitter: string;
      // };
      // status: string;
      // is_subscribed: boolean;
      // social_status: boolean;
      //   show_phone: new FormControl()
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
      this.avt = image.target.result;
      // console.log(image);
      // console.log(a);
      // console.log(reader);
    };
  }
  public onChangeImage1(image, a) {
    let file = image.target.files;
    // console.log(image1.urlImage);
    let reader = new FileReader();
    reader.readAsDataURL(file[0]);
    reader.onload = (image) => {
      // this.urlImageBanner = reader.result as string;
      // console.log(image);
      // this.avt = image.target.result;
    };
  }
  public onChangeImage2(image, a) {
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
  public save() {}

  public buttonToggleAddCategory() {
    this.toggleAddCategory = !this.toggleAddCategory;
  }
  public index =0;
  public addbanner(index){

  }
}
