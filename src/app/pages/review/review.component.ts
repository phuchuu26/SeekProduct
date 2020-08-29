import { Component, OnInit } from '@angular/core';
import {HttpHeaders, HttpClient} from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";
import Swal from 'sweetalert2';
import { from } from 'rxjs';
@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css']
})
export class ReviewComponent implements OnInit {

  constructor(private http : HttpClient, private spinner: NgxSpinnerService) { }
  review = [];
  product_Full = [];
  selectProduct : string = '';
  review_product = [];
  name: string = '';
  email: string = '';
  rating: number = 1;
  content: string = '';
  product: string = '';
  site : string = '';
  check : boolean = false;
  checkedit: boolean = false;
  reviewID: string = '';
  ngOnInit(): void {
    this.product_list();
    
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
      this.http.get<any>('https://seekproduct-api.misavu.net/api/user/review/list/product/'+ this.selectProduct,{
      headers: new HttpHeaders({
        Authorization: 'JWT ' + localStorage.getItem('TOKEN')
      })}).subscribe(data => {
      this.review = data.results;
      var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      this.review.forEach((value)=>{
        var day = new Date(value.created_at);
        console.log(day.toLocaleDateString("en-US",options));
        value.created_at = day.toLocaleDateString("en-US",options);
      });
      console.log(this.review);
  });
    });
  }

  changeData(event : any){
    console.log(event.value);
    this.selectProduct = event.value;
    this.product = event.value;
    this.http.get<any>('https://seekproduct-api.misavu.net/api/user/review/list/product/'+ event.value,{
      headers: new HttpHeaders({
        Authorization: 'JWT ' + localStorage.getItem('TOKEN')
      })}).subscribe(data => {
      this.review = data.results;
      var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      this.review.forEach((value)=>{
        var day = new Date(value.created_at);
        console.log(day.toLocaleDateString("en-US",options));
        value.created_at = day.toLocaleDateString("en-US",options);
      });
      console.log(this.review);
  });
  }
  page : number = 1;
  pageChanged(event : any){
    this.page = event;
  }
  yourFn(event: any) {
    console.log(event.index);
    this.page = 1;
    if (event.index == 0) {
      
    } else if (event.index == 1) {
      
    }
  }
  EditReview(id : any){
    console.log(id);
    const temp = this.review.filter(item => item.id == id)[0];
    const user : any = JSON.parse(localStorage.getItem('USER'));
    console.log(temp);
    console.log(user.username);
    if(temp.user_details.username == user.username){
      this.check = true;
      this.checkedit = true;
      console.log(user.username + "/" + temp.user_details.username);
      this.product = temp.product;
      this.name = temp.name;
      this.email = temp.email;
      this.selectProduct = temp.product;
      this.content = temp.content;
      this.rating = temp.rating;
      this.reviewID = temp.id;
    } else {
      this.check = false;
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'You Unauthorized\n',
        showConfirmButton: false,
        timer: 1500
      });
    }
  }

  openCreateReview(){
    this.product = this.selectProduct;
    this.checkedit = false;
    this.check = true;
    this.name = '';
    this.email = '';
    this.content = '';
    this.rating = 1;
  }
  onChange(event : any){
    console.log(event.target.id + "=" + event.target.value);
    this[event.target.id] = event.target.value;
  }
  onChangeRating(event : any){
    console.log(event);
    this.rating = event;
  }
  submit(){
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    console.log(re.test(this.email));
    if(this.name != ''&& this.content != '' && re.test(this.email)){
    this.spinner.show();
    if(this.checkedit === false){
    const formdata = new FormData();
    const user : any = JSON.parse(localStorage.getItem('USER'));
    formdata.set('product', this.product);
    formdata.set('name',this.name);
    formdata.set('email', this.email);
    formdata.set('rating', this.rating+'');
    formdata.set('content', this.content);
    formdata.set('user', user.id);
    this.http.post<any>('https://seekproduct-api.misavu.net/api/user/review/create', formdata,{
      headers: new HttpHeaders({
        Authorization: 'JWT ' + localStorage.getItem('TOKEN')
      })}).subscribe((data)=>{
        console.log(data);
        this.http.get<any>('https://seekproduct-api.misavu.net/api/user/review/list/product/'+ this.product,{
      headers: new HttpHeaders({
        Authorization: 'JWT ' + localStorage.getItem('TOKEN')
      })}).subscribe(data => {
        this.spinner.hide();
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'You Add Success',
          showConfirmButton: false,
          timer: 1500
        });
      this.review = data.results;
      var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      this.review.forEach((value)=>{
        var day = new Date(value.created_at);
        console.log(day.toLocaleDateString("en-US",options));
        value.created_at = day.toLocaleDateString("en-US",options);
      });
      });
  }, err => {
    this.spinner.hide();
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'You Add FAIL\n',
          showConfirmButton: false,
          timer: 1500
        });
  });
    } else if(this.checkedit === true){
      const formdata = new FormData();
    const user : any = JSON.parse(localStorage.getItem('USER'));
    formdata.set('product', this.product);
    formdata.set('name',this.name);
    formdata.set('email', this.email);
    formdata.set('rating', this.rating+'');
    formdata.set('content', this.content);
    formdata.set('user', user.id);
    this.http.put<any>('https://seekproduct-api.misavu.net/api/user/review/'+this.reviewID+'/update', formdata,{
      headers: new HttpHeaders({
        Authorization: 'JWT ' + localStorage.getItem('TOKEN')
      })}).subscribe((data)=>{
        console.log(data);
        this.checkedit = false;
        this.spinner.hide();
        this.review.forEach((value)=>{
          if(value.id == this.reviewID){
            value.name = data.name;
            value.content = data.content;
            value.rating = data.rating;
          }
        });
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'You Update Success',
          showConfirmButton: false,
          timer: 1500
        });
      }, err => {
        this.spinner.hide();
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'You Update FAIL\n',
          showConfirmButton: false,
          timer: 1500
        });
      });
    }
  }
  }
  deleteReview(id : any){
    console.log(id);
    const temp = this.review.filter(item => item.id == id)[0];
    const user : any = JSON.parse(localStorage.getItem('USER'));
    console.log(temp);
    console.log(user.username);
    if(temp.user_details.username == user.username){
    console.log(user.username + "/" +temp.user_details.username );
    this.http.get<any>('https://seekproduct-api.misavu.net/api/user/product/' + temp.product, {
      headers: new HttpHeaders({
        Authorization: 'JWT ' + localStorage.getItem('TOKEN')
      })
    }).subscribe((data)=>{
      this.site = data.site;
    });
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
        const formdata = new FormData();
        formdata.set('site',this.site);
        formdata.set('product',temp.product);
        const options = {
          body: formdata,
          headers: new HttpHeaders({
            Authorization: 'JWT ' + localStorage.getItem('TOKEN')
          })
        };
        this.http.delete<any>('https://seekproduct-api.misavu.net/api/user/review/'+id+'/delete',options)
        .subscribe((event : any) => {
            this.spinner.hide();
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'You delete Success',
              showConfirmButton: false,
              timer: 1500
            });
            this.review = this.review.filter(item => item.id != id);
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
   } else {
    Swal.fire({
      position: 'center',
      icon: 'error',
      title: 'You Unauthorized\n',
      showConfirmButton: false,
      timer: 1500
    });
   }
    
    
  }
}
