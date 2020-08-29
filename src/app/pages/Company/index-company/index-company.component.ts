import { Router } from "@angular/router";
import { Component, OnInit, DoCheck } from "@angular/core";
import { ServerHttpService } from "src/app/Services/server-http.service";
import { AllMyCompany, Company } from "src/app/models/user";
import { SnotifyService, SnotifyPosition } from "ng-snotify";

@Component({
  selector: "app-index-company",
  templateUrl: "./index-company.component.html",
  styleUrls: ["./index-company.component.css"],
})
export class IndexCompanyComponent implements OnInit ,DoCheck{
  public allmycompany: AllMyCompany;
  public p: number = 1;
  public allmycompany1;
  public companies;
  public linkStripe:string;
  public Com;
  // public count1 : number;
  constructor(private http: ServerHttpService, private router: Router
    ,
    private snotify: SnotifyService,
    ) {}
  ngDoCheck(): void {
    // console.log(this.Com);
    // console.log(this.allmycompany1);
    localStorage.setItem("ALLCOMPANY",JSON.stringify(this.allmycompany1 ));
  }
  ngOnInit(): void {
    let i =2;
    let test :Company[];
    this.http.GetAllMyCompany( 1).subscribe( async (data)=>{
            console.log(data);
            test = data.results;
             if( await data.results != null){
                for(  let j = 10; j < await +data.count; j=j+10){
                  await  this.http.GetAllMyCompany(i).subscribe( async(data1)=>{
                  console.log(data1);
                  await data1.results.forEach((res)=>{
                      test.push( res);
                  })

                })
                i++;
                // await localStorage.removeItem("ALLMYCOMPANY");
                // await localStorage.setItem("ALLMYCOMPANY",JSON.stringify(await test));
              }
              console.log(test);
               this.allmycompany1 = await test;
              console.log(this.allmycompany1);

              // await console.log(this.Com);
              // await localStorage.setItem("ALLMYCOMPANY",JSON.stringify(await test));
            }
            // await localStorage.setItem("ALLMYCOMPANY",JSON.stringify(await this.allmycompany1 ));
          });

        // const a = localStorage.getItem("ALLMYCOMPANY");
    // this.allmycompany = JSON.parse(a);
    // this.http.GetAllMyCompany(1).subscribe((data) => {
    //   //   console.log(data);
    //   this.allmycompany1 = data;
    //   if(data.next != null){
    //     let x = +data.count ;
    //     let j =2 ;
    //     for(let i =10; i <= x ; i= i+10){
    //       this.http.GetAllMyCompany(j).subscribe((data)=>{
    //         console.log(data);
    //       })
    //       j= j+1;
    //     }
    //   }
    // });

    // let i =2;
    // let test :Company[];
    //  this.http.GetAllMyCompany(1).subscribe(  (data)=>{
    //   console.log(data);
    //   test = data.results;
    //   if(data.results != null){
    //     for(let j = 10; j < +data.count; j=j+10){
    //       this.http.GetAllMyCompany(i).subscribe((data1)=>{
    //         console.log(data1);
    //         data1.results.forEach((res)=>{
    //           test.push(res);
    //         })
    //       })
    //       i++;
    //     }
    //     console.log(test);
    //     this.Com =  test;
    //      localStorage.setItem("ALLCOMPANY",JSON.stringify( this.Com ));

    //      console.log(this.Com);
    //   }
    // });


    this.http.getConnectStripe().subscribe((data)=>{
      // console.log(data);
      this.linkStripe = data;
    })
    // console.log(this.allmycompany1);
    // this.companies = this.allmycompany.results;
  }

  public detailUser(site) {
    // console.log(id);
    this.router.navigate(["detailcompany", site]);
  }
  deleteComany(site,name){
    this.http.deleteCompany(site).subscribe(async(data) =>{
      await this.router.navigate(["dashboard"]);
      this.success(name);
      await this.router.navigate(["allmycompany"]);
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

  public success(a) {
    this.snotify.info(`Company ${a} has been deleted successfully`, "Confirm", {
      position: SnotifyPosition.rightTop,
      timeout: 3000,
      showProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
    });
  }

  public failed(a, b) {
    this.snotify.error(`Deleted company failed by ${a} ${b}`, "Confirm", {
      position: SnotifyPosition.rightTop,
      timeout: 4000,
      showProgressBar: true,
      closeOnClick: false,
      pauseOnHover: true,
    });
  }
}
