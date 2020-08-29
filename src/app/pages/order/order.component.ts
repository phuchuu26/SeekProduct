import { Component, OnInit, DoCheck } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {FormControl} from '@angular/forms';
import { NgxSpinnerService } from "ngx-spinner";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit, DoCheck {
  toppings = new FormControl();
  myProduct = new FormControl();
  toppingList = [];
  company_Arr = [];
  order_Arr = [];
  myProduct_Arr = [];
  email: string = '';
  phone: string = '';
  first_name: string = '';
  last_name: string = '';
  address_line_1: string = '';
  address_line_2: string = '';
  postcode: string = '';
  suburb: string = '';
  state: string = '';
  country: string = '';
  check : boolean = false;
  selectedValue: string = '';
  checkSubmit: boolean = false;
  constructor(private http : HttpClient,private spinner: NgxSpinnerService) { }

  openDialog(){
    this.check = !this.check;
    this.clearData();
  }
  async product_list() {
    let count = 0;
    let temp = [];
    this.toppingList = [];
    await this.http.get<any>('https://seekproduct-api.misavu.net/api/user/product/?page=' + 1, {
      headers: new HttpHeaders({
        Authorization: 'JWT ' + localStorage.getItem('TOKEN'),
      })
    }).subscribe(async (data) => {
      // console.log(data.results.length);
      // console.log(data.count);
      count = data.count;
      for (var a = 0; a < data.results.length; a++) {
        temp[temp.length] = data.results[a];
      }
      var j = 2;
      for (var i = 10; i < count; i = i + 10) {
        this.http.get<any>('https://seekproduct-api.misavu.net/api/user/product/?page=' + j, {
          headers: new HttpHeaders({
            Authorization: 'JWT ' + localStorage.getItem('TOKEN'),
          })
        }).subscribe((res) => {
          for (var b = 0; b < res.results.length; b++) {
            temp[temp.length] = res.results[b];
          }
        });
        j++;
      }
      await console.log(temp);
      this.toppingList = await temp;
    });
  }
  ngOnInit(): void {
    this.http.get<any>('https://seekproduct-api.misavu.net/api/user/company/my-company/', {
      headers: new HttpHeaders({
        Authorization: 'JWT ' + localStorage.getItem('TOKEN'),
      })
    }).subscribe((data)=>{
      console.log(data.results);
      this.company_Arr = data.results;
      this.selectedValue = data.results[0].site;
      this.http.get<any>('https://seekproduct-api.misavu.net/api/user/order/list?page=1&page_size=10&site='+data.results[0].site, {
      headers: new HttpHeaders({
        Authorization: 'JWT ' + localStorage.getItem('TOKEN'),
      })
    }).subscribe((res)=>{
      console.log(res.results);
      this.order_Arr = res.results;
    });
    });
    this.product_list();
    this.http.get<any>('https://seekproduct-api.misavu.net/api/user/company/my-company/', {
      headers: new HttpHeaders({
        Authorization: 'JWT ' + localStorage.getItem('TOKEN'),
      })
    }).subscribe((data)=>{

    });
  }
  nameca : string = '';
  ngDoCheck(): void {
    if (this.toppingList) {
      if (this.myProduct.value != null) {
        for (let option of this.toppingList) {
          if (option.id == this.myProduct.value[0]) {
            this.nameca = option.name + "(site : " + option.site + ")";
          }
        }
      }
    }
  }
  productArray(){
    this.myProduct_Arr = [];
    if (this.toppingList) {
      if (this.myProduct.value != null) {
        this.myProduct.value.forEach(item1 => {
          this.toppingList.forEach(item=>{
            if(item.id == item1){
              console.log(item.name + " : " + item.id);
              this.myProduct_Arr.push(item.id);
            }
          });
        });
      }
    }
  }

  changeData(event : any){
    console.log(event.target.id + " = " + event.target.value);
    this[event.target.id] = event.target.value;
  }
  changeCompany(event: any){
    console.log("Select : " + event.value);
    this.selectedValue = event.value;
    this.http.get<any>('https://seekproduct-api.misavu.net/api/user/order/list?page=1&page_size=10&site='+event.value, {
      headers: new HttpHeaders({
        Authorization: 'JWT ' + localStorage.getItem('TOKEN'),
      })
    }).subscribe((res)=>{
      console.log(res.results);
      this.order_Arr = res.results;
    });
  }

  addOrder(){
    const formdata = new FormData();
    formdata.set('email',this.email);
    formdata.set('phone',this.phone);
    formdata.set('first_name',this.first_name);
    formdata.set('last_name',this.last_name);
    formdata.set('address_line_1',this.address_line_1);
    formdata.set('address_line_2',this.address_line_2);
    formdata.set('postcode',this.phone);
    formdata.set('suburb',this.suburb);
    formdata.set('state',this.state);
    formdata.set('country',this.country);

    this.myProduct_Arr.forEach((value,key)=>{
      console.log(value);
      formdata.append('product_id',value);
    });

    console.log(this.country);
    this.http.post<any>('https://seekproduct-api.misavu.net/api/user/order/create',formdata,{
        headers: new HttpHeaders({
          Authorization: 'JWT ' + localStorage.getItem('TOKEN'),
        })
      }).subscribe((data)=>{
        this.spinner.hide();
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'You Order Success',
          showConfirmButton: false,
          timer: 1500
        });
        this.http.get<any>('https://seekproduct-api.misavu.net/api/user/order/list?page=1&page_size=10&site='+this.selectedValue, {
      headers: new HttpHeaders({
        Authorization: 'JWT ' + localStorage.getItem('TOKEN'),
      })
    }).subscribe((res)=>{
      console.log(res.results);
      this.order_Arr = res.results;
    });
    this.checkSubmit = false;
        this.openDialog();
        console.log(data);
      });
  }
  clearData(){
  this.myProduct.reset();
  this.email = '';
  this.phone = '';
  this.first_name = '';
  this.last_name = '';
  this.address_line_1 = '';
  this.address_line_2 = '';
  this.postcode = '';
  this.suburb = '';
  this.state = '';
  this.country = '';
  }
  Info(id : any){
    console.log(id);
    this.http.get<any>('https://seekproduct-api.misavu.net/api/user/order/details/'+id+'?site='+this.selectedValue, {
      headers: new HttpHeaders({
        Authorization: 'JWT ' + localStorage.getItem('TOKEN'),
      })
    }).subscribe((res)=>{
      console.log(res);
    });
  }

  submit(){
    
    this.checkSubmit = true;
    if(this.email != '' && this.phone != '' && this.first_name != '' &&
    this.last_name != '' && this.address_line_1 != '' &&
    this.address_line_2 != '' && this.postcode != '' && this.suburb != '' &&
    this.state != '' && this.country != ''){
      this.spinner.show();
      this.addOrder();
    }
  }
  page : number = 1;
  pageChanged(event : any){
    this.page = event;
  }

}
