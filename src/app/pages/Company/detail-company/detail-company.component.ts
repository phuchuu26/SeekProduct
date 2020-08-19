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

@Component({
  selector: "app-detail-company",
  templateUrl: "./detail-company.component.html",
  styleUrls: ["./detail-company.component.css"],
})
export class DetailCompanyComponent implements OnInit {
  public companyForm: FormGroup;
  public companyProfile: Company;
  public site: string;
  public urlImage: string;
  public avt;
  public category: Category[];
  constructor(
    private snotify: SnotifyService,
    private http: ServerHttpService,
    private forms: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.site = this.route.snapshot.paramMap.get("id");
    //get detail by  localStore:
    let com, compa,index;
    com = localStorage.getItem("ALLMYCOMPANY");
    compa = JSON.parse(com);
    com = compa.results;
    if(this.site){


      function findIndexByKeyValue(com, site,value) {
        for (var index = 0; index < com.length; index++) {
            if (com[index][site] === value) {
                return index;
            }
        }
        return -1;
      }
      index = findIndexByKeyValue(com, 'site', this.site);
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

    this.http.getAllCategory().subscribe((data)=>{
      console.log(data);
    })

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
    };
  }
  public save() {}
}
