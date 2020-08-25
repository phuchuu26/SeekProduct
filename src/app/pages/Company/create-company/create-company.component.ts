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

@Component({
  selector: "app-create-company",
  templateUrl: "./create-company.component.html",
  styleUrls: ["./create-company.component.css"],
})
export class CreateCompanyComponent
  implements OnInit, DoCheck {
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
    private route: ActivatedRoute
  ) {}
  // private _filter(value: string): string[] {
  //   const filterValue = value.toLowerCase();

  //   return this.options.filter(option => option.toLowerCase().includes(filterValue));
  // }
 public  nameCa(){
    this.cateChoosed = [];
    if (this.toppingList) {

      if (this.category.value != null) {
        this.category.value.forEach(item1 => {
          this.toppingList.forEach(item=>{
            if(item.id == item1){
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
      store_name: new FormControl(),
      address: new FormControl(),
      phone_number: new FormControl(),
      legal_name: new FormControl(),
      site: new FormControl(),
      business_license: new FormControl(),
      logo: new FormControl("", []),
      ad_sample: new FormControl(null,[]),
      about: new FormControl(),
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
  public onChangeImage(image,files ,a) {
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
  public onChangeAdSample(image, a,i) {
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
  public onChangeBanner(image, i:number,e, a) {
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
    formdata.set('store_name',a.store_name);
    formdata.set('address',a.address);
    formdata.set('phone_number',a.phone_number);
    formdata.set('legal_name',a.phone_number);
    formdata.set('site',a.site);
    formdata.set('business_license',a.business_license);
    if(this.fileToUpload != null){
      formdata.append('logo',this.fileToUpload, this.fileToUpload.name);
    } else formdata.append('logo','');
    if(this.fileToUpload1 != null){
      formdata.append('ad_sample',this.fileToUpload1, this.fileToUpload1.name);
    } else formdata.append('ad_sample','');
    formdata.set('about',a.about);
    a.category.forEach((value,i)=>{
      if(a.category[i] != null){
        formdata.append('category',a.category[i].toString());
      }else formdata.append('category','');
    })
    a.banner.forEach((value,i)=>{
      if(this.aa[i] != null){
        formdata.append('banner',this.aa[i], this.aa[i].name);
      } else formdata.append('banner','');
    })


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



    this.http.createCompany(formdata).subscribe((data)=>{

      console.log(data);
      // this.router.navigate(["login"]);
      this.success(this.companyForm.controls.store_name.value);
    }, (error)=>{
      this.failed();
    })
    //  console.log(typeof this.companyForm.controls.category.value);
    //  console.log(this.companyForm.controls.category.value);
    //  console.log(this.category);
    //  console.log(typeof this.companyForm.controls.banner.value);
    //  console.log(this.companyForm.controls.banner.value);
  }
  public success(a){
    this.snotify.info(`Company ${a} has been created successfully`, "Confirm", {
      position: SnotifyPosition.rightTop,
      timeout: 3000,
      showProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
    });
  }

  public failed(){
    this.snotify.error(`Create company failed by system error`, "Confirm", {
      position: SnotifyPosition.rightTop,
      timeout: 3000,
      showProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
    });
  }
}
