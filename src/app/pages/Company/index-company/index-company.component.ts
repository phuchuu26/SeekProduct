import { Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { ServerHttpService } from "src/app/Services/server-http.service";
import { AllMyCompany } from "src/app/models/user";

@Component({
  selector: "app-index-company",
  templateUrl: "./index-company.component.html",
  styleUrls: ["./index-company.component.css"],
})
export class IndexCompanyComponent implements OnInit {
  public allmycompany: AllMyCompany;
  public allmycompany1: AllMyCompany;
  public companies;
  public linkStripe:string;
  // public count1 : number;
  constructor(private http: ServerHttpService, private router: Router) {}

  ngOnInit(): void {
    const a = localStorage.getItem("ALLMYCOMPANY");
    this.allmycompany = JSON.parse(a);
    this.http.GetAllMyCompany().subscribe((data) => {
      //   console.log(data);
      this.allmycompany1 = data;
    });

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
