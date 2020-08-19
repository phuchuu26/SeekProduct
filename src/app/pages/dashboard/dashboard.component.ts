import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js';

// core components
import {
  chartOptions,
  parseOptions,
  chartExample1,
  chartExample2
} from "../../variables/charts";
import { ServerHttpService } from 'src/app/Services/server-http.service';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public datasets: any;
  public data: any;
  public salesChart;
  public clicked: boolean = true;
  public clicked1: boolean = false;

  constructor(
    private http: ServerHttpService,
    private httpClient: HttpClient
  ) { }
// public  test = {
//   description: "abc",
//   name: "abc",
//   color: "abc",
//   downloads: "abc",
//   faq: "abc",
//   full_description: "abc",
//   image: "abc",
//   in_stock: 5,
//   model: "abc",
//   price: 15,
//   productgroup: 176,
//   tag: "abc",
//   vat: "12",
//   category:[6],
// };
  ngOnInit() {
    // this.http.test(this.test).subscribe((data)=>{
    //   console.log(data);
    // }, (error)=>{
    //   console.log(error);
    // })

    setInterval(()=>{                           //<<<---using ()=> syntax
      this.http.shouldCallAPIrefreshToken();
 }, 1000);





    this.datasets = [
      [0, 20, 10, 30, 15, 40, 20, 60, 60],
      [0, 20, 5, 25, 10, 30, 15, 40, 40]
    ];
    this.data = this.datasets[0];


    var chartOrders = document.getElementById('chart-orders');

    parseOptions(Chart, chartOptions());


    var ordersChart = new Chart(chartOrders, {
      type: 'bar',
      options: chartExample2.options,
      data: chartExample2.data
    });

    var chartSales = document.getElementById('chart-sales');

    this.salesChart = new Chart(chartSales, {
			type: 'line',
			options: chartExample1.options,
			data: chartExample1.data
    });
    // console.log(this.http.tokenLogin);
    // if(this.http.tokenLogin){
    //   this.http.getProfile().subscribe((data)=>{
    //     console.log(data);
    //   })

    // }



    // this.a();
  }



  // public a(){
  //   this.httpClient
  //   .get<any>(
  //     "https://seekproduct-api.misavu.net/api/auth/profile"
  //     ,
  //     {
  //       headers: new HttpHeaders({
  //         Accept: "application/json",
  //         "Content-Type": "application/json",
  //         Authorization:`JWT ${this.http.tokenLogin}`,
  //       }),
  //     }
  //   )
  //   .subscribe((result) => {
  //     console.log(result);
  //     // this.token = result;
  //     console.log(this.http.tokenLogin);
  //   });
  // }

  public updateOptions() {
    this.salesChart.data.datasets[0].data = this.data;
    this.salesChart.update();
  }

}
