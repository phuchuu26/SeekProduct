import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http'
import { from } from 'rxjs';
import { NgxSpinnerService } from "ngx-spinner";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  constructor(private http : HttpClient, private spinner: NgxSpinnerService) { }
  viewCartArray = [];
  cartHistory = [];
  page : number = 1;
  product_Full = [];
  product:string = '';
  amount: string = '';
  total : number = 0;
  price: number = 0;
  selectProduct: string = '';
  checkEdit : boolean = false;
  checkNumber: boolean = false;
  ngOnInit(): void {
    this.http.get<any>('https://seekproduct-api.misavu.net/api/user/cart/view-cart/', {
      headers: new HttpHeaders({
        Authorization: 'JWT ' + localStorage.getItem('TOKEN'),
      })
    }).subscribe((data)=>{
      let sum = 0;
      console.log(data.cart_detail);
      this.viewCartArray = data.cart_detail;
      data.cart_detail.forEach((value)=> {
        sum += value.total;
      });
      console.log(sum);
      this.total = sum;
    });
    this.product_list();
    //this.total_Sum();
  }
  async total_Sum(){
    let sum = 0;
    await this.viewCartArray.forEach((value)=> {
      sum += value.total;
    });
    console.log(await sum);
    this.total = await sum;
  }
  async product_list() {
    let count = 0;
    let temp = [];
    this.product_Full = [];
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
      this.product_Full = await temp;
      this.selectProduct = await temp[0].id;
    });
  }

  deleteProduct(id : any){
    console.log(id);
    Swal.fire({
      title: 'Are you sure?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        this.spinner.show();
        const product = {product : id};
        const options = {
          body: product,
          headers: new HttpHeaders({
            Authorization: 'JWT ' + localStorage.getItem('TOKEN')
          })
        };
        this.http.post<any>('https://seekproduct-api.misavu.net/api/user/cart/remove-from-cart',product, {
          headers: new HttpHeaders({
            Authorization: 'JWT ' + localStorage.getItem('TOKEN')
          }),
          observe: 'response',
        }).subscribe((event : any) => {
          console.log(event.body.cart_detail);
          this.viewCartArray = event.body.cart_detail;
          this.total_Sum();
            this.spinner.hide();
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'You delete Success',
              showConfirmButton: false,
              timer: 1500
            });
  
        }, err =>{
          this.spinner.hide();
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'You delete FAIL\n',
            showConfirmButton: false,
            timer: 1500
          });
        });
      }
    });
  }
  yourFn(event: any) {
    console.log(event.index);
    this.page = 1;
    if (event.index == 0) {
      
    } else if (event.index == 1) {
      this.http.get<any>('https://seekproduct-api.misavu.net/api/user/cart/history', {
        headers: new HttpHeaders({
          Authorization: 'JWT ' + localStorage.getItem('TOKEN')
        })
      }).subscribe((data) => {
        console.log(data.results);
        this.cartHistory = data.results;
      });
    }
  }

  onChange(event : any){
    console.log(event.target.id + " = " + event.target.value);
    this[event.target.id] = event.target.value;
    if(event.target.id == 'product'){
      this.price = this.product_Full.filter(item=> item.id == event.target.value)[0].price;
    }
    if(parseInt(this.amount) < 1){
      this.checkNumber = true;
    }else this.checkNumber = false;
  }
  submit(){
    const product = {product : this.product, amount: parseInt(this.amount)};
    
    if(this.amount != '' && parseInt(this.amount) > 0){
    if(this.checkEdit === false){
      this.spinner.show();
      this.http.post<any>('https://seekproduct-api.misavu.net/api/user/cart/add-to-cart',product, {
        headers: new HttpHeaders({
          Authorization: 'JWT ' + localStorage.getItem('TOKEN')
        })
      }).subscribe((data)=>{
        console.log(data.cart_detail);
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'You Add Success',
          showConfirmButton: false,
          timer: 1500
        });
        this.spinner.hide();
        this.viewCartArray = data.cart_detail;
        this.total_Sum();
      }, err => {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'You Add FAIL\n',
          showConfirmButton: false,
          timer: 1500
        });
        this.spinner.hide();
      });
  } else if(this.checkEdit === true){
    this.spinner.show();
    this.http.post<any>('https://seekproduct-api.misavu.net/api/user/cart/update-cart',product, {
        headers: new HttpHeaders({
          Authorization: 'JWT ' + localStorage.getItem('TOKEN')
        })
      }).subscribe((data)=>{
        this.checkEdit = false;
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'You Update Success',
          showConfirmButton: false,
          timer: 1500
        });
        this.spinner.hide();
        this.viewCartArray = data.cart_detail;
        this.total_Sum();
      }, err => {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'You Update FAIL\n',
          showConfirmButton: false,
          timer: 1500
        });
        this.spinner.hide();
      });
  }
}
  }
  checkAdd(){
    this.checkEdit = false;
    this.selectProduct =  this.product_Full[0].id;
    this.product = this.product_Full[0].id;
    this.amount = '';
    this.price = this.product_Full[0].price;
  }
  pageChanged(event : any){
    this.page = event;
  }

  EditProduct(id : any){
    this.checkEdit = true;
    console.log(id);
    console.log(this.viewCartArray.filter(item => item.product.id == id)[0]);
    const temp = this.viewCartArray.filter(item => item.product.id == id)[0];
    this.product = temp.product.id;
    this.amount = temp.amount;
    this.selectProduct = temp.product.id;
    this.price = this.product_Full.filter(item=> item.id == id)[0].price;
  }
}
