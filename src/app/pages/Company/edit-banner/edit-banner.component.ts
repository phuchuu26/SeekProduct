import { Component, OnInit } from '@angular/core';
import { Company } from 'src/app/models/user';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { ServerHttpService } from 'src/app/Services/server-http.service';
import { SnotifyService, SnotifyPosition } from 'ng-snotify';

@Component({
  selector: 'app-edit-banner',
  templateUrl: './edit-banner.component.html',
  styleUrls: ['./edit-banner.component.css']
})
export class EditBannerComponent implements OnInit {
  public companyProfile:Company;
  site :string ;
  companyForm:FormGroup
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private snotify: SnotifyService,
    private http: ServerHttpService,
    private forms: FormBuilder,

  ) { }

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
    console.log(this.companyProfile);
    this.urlImageBanner[0] = "https://www.osustuff.org/images/placeholder.png";
    this.companyForm = this.forms.group({

      banner: this.forms.array([this.forms.control("")]),

    });
  }
  save(){
    console.log(this.aa);
    const formdata = new FormData();
    formdata.set("store_name", this.companyProfile.store_name);
    formdata.set("address", this.companyProfile.address);
    formdata.set("phone_number", this.companyProfile.phone_number);
    formdata.set("legal_name", this.companyProfile.phone_number);
    formdata.set("site", this.companyProfile.site);
    formdata.set("business_license", this.companyProfile.business_license);

    if (this.companyProfile.category != null) {
      this.companyProfile.category.forEach((value, i) => {
        if (this.companyProfile.category[i] != null) {
          formdata.append("category", this.companyProfile.category[i].toString());
        } else formdata.append("category", "");
      });
    }
    this.aa.forEach((value, i) => {
      if (this.aa[i] != null) {
        formdata.append("banner", this.aa[i], this.aa[i].name);
      } else formdata.append("banner", "");
    });

    this.http.updateBanner(this.companyProfile.site,formdata).subscribe((data) => {
      this.success(this.companyProfile.store_name);
      // this.router.navigate(["allmycompany"]);
      this.router.navigate(["detailcompany", this.companyProfile.site]);
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
    })
  }

  index=0;
  addbanner(i){
    this.urlImageBanner[i + 1] =
    "https://www.osustuff.org/images/placeholder.png";
    this.bannerList.push(this.forms.control(""));
    this.index++;
  }
  get bannerList() {
    return this.companyForm.get("banner") as FormArray;
  }
  public urlImageBanner: string[] = [];

  public aa = [];
  public onChangeBanner(image, i: number, e, a) {
    var fileToUploadBanner: File = null;
    fileToUploadBanner = e.item(0);
    // this.aa.push(fileToUploadBanner);
    this.aa[i] = fileToUploadBanner;

    let file = image.target.files;
    let reader = new FileReader();
    reader.readAsDataURL(file[0]);
    reader.onload = (image) => {
      this.urlImageBanner[i] = reader.result as string;
    };
  }



  backCompany(site){
    this.router.navigate(["detailcompany", site]);
  }




  public success(a) {
    this.snotify.info(`Company ${a} has been updated Banner successfully`, "Confirm", {
      position: SnotifyPosition.rightTop,
      timeout: 3000,
      showProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
    });
  }

  public failed(a, b) {
    this.snotify.error(`Updated Banner company failed by ${a} ${b}`, "Confirm", {
      position: SnotifyPosition.rightTop,
      timeout: 4000,
      showProgressBar: true,
      closeOnClick: false,
      pauseOnHover: true,
    });
  }
}
