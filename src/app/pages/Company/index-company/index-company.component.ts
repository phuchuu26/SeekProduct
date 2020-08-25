import { Router } from "@angular/router";
import { Component, OnInit, DoCheck } from "@angular/core";
import { ServerHttpService } from "src/app/Services/server-http.service";
import { AllMyCompany, Company } from "src/app/models/user";

@Component({
  selector: "app-index-company",
  templateUrl: "./index-company.component.html",
  styleUrls: ["./index-company.component.css"],
})
export class IndexCompanyComponent implements OnInit ,DoCheck{
  public allmycompany: AllMyCompany;
  public allmycompany1;
  public companies;
  public linkStripe:string;
  public Com;
  // public count1 : number;
  constructor(private http: ServerHttpService, private router: Router) {}
  ngDoCheck(): void {
    console.log(this.Com);
    localStorage.setItem("ALLCOMPANY",JSON.stringify( this.Com ));
  }
  ngOnInit(): void {
    let i =2;
    let test :Company[];
    this.http.GetAllMyCompany(1).subscribe( async (data)=>{
            console.log(data);
            test = data.results;
            if(data.results != null){
              for(let j = 10; j < +data.count; j=j+10){
                this.http.GetAllMyCompany(i).subscribe(async(data1)=>{
                  console.log(data1);
                  data1.results.forEach((res)=>{
                    test.push(res);
                  })

                })
                i++;

              }
              console.log(test);
              this.allmycompany1 = await test;
              await localStorage.setItem("ALLMYCOMPANY",JSON.stringify( await this.Com ));

              await console.log(this.Com);
            }
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
}
