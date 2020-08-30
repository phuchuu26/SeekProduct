import { Component, OnInit, ViewChild } from '@angular/core';
import {AppState} from '../store/models/app-state.model';
import {Subscription} from '../store/models/subscription.model';
import { Store } from '@ngrx/store';
import { from } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { ServerHttpService } from 'src/app/Services/server-http.service';
import Swal from 'sweetalert2';
import { StripeService, StripeCardComponent } from 'ngx-stripe';
import {
  StripeCardElementOptions,
  StripeElementsOptions
} from '@stripe/stripe-js';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.css']
})
export class SubscriptionComponent implements OnInit {
  subscriptionItems = [];
  company = [];
  planArr = [];
  show : boolean = false;
  checkEdit : boolean = false;
  company_id : string;
  plan_id : string;
  trial_period_days: string;
  item : Subscription = {company:{id:0,address:'',logo:'',phone_number:'',store_name:''}, 
  company_id:0,plan_id:'', trial_period_days:'',plan:{id:0,name:'',price:0}};
  subscriptionEdit : Subscription = {company:{id:0,address:'',logo:'',phone_number:'',store_name:''}, 
  company_id:0,plan_id:'', trial_period_days:'',plan:{id:0,name:'',price:0}};

  err : boolean = false;

  constructor(private store: Store<AppState>,
    private http : HttpClient,
    private stripeService: StripeService, 
    private spinner: NgxSpinnerService) { }
    @ViewChild(StripeCardComponent) card: StripeCardComponent;

    cardOptions: StripeCardElementOptions = {
      hidePostalCode: true,
      style: {
        base: {
          iconColor: '#666EE8',
          color: '#31325F',
          fontWeight: '300',
          fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
          fontSize: '18px',
          '::placeholder': {
            color: '#CFD7E0'
          }
        }
      }
    };
    elementsOptions: StripeElementsOptions = {
      locale: 'auto'
    };
    checkPayment: boolean = false;
    openPayment(){
      this.spinner.show();
      this.http.get<any>('https://seekproduct-api.misavu.net/api/user/payment/check-payment-source',{
        headers: new HttpHeaders({
          Authorization: 'JWT ' + localStorage.getItem('TOKEN')
        })}).subscribe((data)=>{
          if(data.source == true){
            this.checkPayment = false;
            this.spinner.hide();
            Swal.fire({
              position: 'center',
              icon: 'warning',
              title: 'Payment source already exist.',
              showConfirmButton: false,
              timer: 1500
            });
          } else if(data.source == false){
            this.checkPayment = true;
            this.spinner.hide();
            
          }
        });
    }
    createToken(): void {
      if(this.checkPayment === true){
        this.spinner.show();
      this.stripeService
        .createToken(this.card.element)
        .subscribe((result) => {
          console.log(result);
          if (result.token) {
            console.log(result.token.id);
            const source = {source :result.token.id};
            this.http.post<any>('https://seekproduct-api.misavu.net/api/user/payment/create-payment-source',source,{
            headers: new HttpHeaders({
              Authorization: 'JWT ' + localStorage.getItem('TOKEN')
            })}).subscribe((res)=>{
              this.spinner.hide();
              this.checkPayment = false;
              Swal.fire({
                position: 'center',
                icon: 'success',
                title: res.message,
                showConfirmButton: false,
                timer: 1500
              });
            });
          } else if (result.error) {
            console.log(result.error.message);
          }
        });
      }
    }
    detachCard(){
      this.spinner.show();
      this.http.get<any>('https://seekproduct-api.misavu.net/api/user/payment/check-payment-source',{
      headers: new HttpHeaders({
        Authorization: 'JWT ' + localStorage.getItem('TOKEN')
      })}).subscribe((res)=>{
        if(res.source == true){
          this.http.post<any>('https://seekproduct-api.misavu.net/api/user/payment/detach-card','',{
            headers: new HttpHeaders({
              Authorization: 'JWT ' + localStorage.getItem('TOKEN')
            })}).subscribe((data)=>{
              this.spinner.hide();
              console.log(data.message);
              Swal.fire({
                position: 'center',
                icon: 'success',
                title: data.message,
                showConfirmButton: false,
                timer: 1500
              });
            }, err => {
              this.spinner.hide();
              console.log(err.message);
              Swal.fire({
                position: 'center',
                icon: 'error',
                title: err.message,
                showConfirmButton: false,
                timer: 1500
              });
            });
        } else if(res.source == false){
          this.spinner.hide();
          Swal.fire({
            position: 'center',
            icon: 'warning',
            title: 'Payment source does not exist.\n You need Create Payment.',
            showConfirmButton: false,
            timer: 1500
          });
        }
      });
      
    }
  ngOnInit() {
    this.http.get<any>('https://seekproduct-api.misavu.net/api/user/subscription/', {
      headers: new HttpHeaders({
        Authorization: 'JWT ' + localStorage.getItem('TOKEN'),
      }),
    }).subscribe((data)=>{
      this.subscriptionItems = data
    });
    this.http.get<any>('https://seekproduct-api.misavu.net/api/user/company/my-company/',{
      headers: new HttpHeaders({
      Authorization: 'JWT ' + localStorage.getItem('TOKEN'),
    })}).subscribe(data => {
      this.company = data.results;
      this.company_id = data.results[0].id;
      this.selectCompany = data.results[0].id;
      console.log(data.results[0].id);
  });

  this.http.get<any>('https://seekproduct-api.misavu.net/api/plan/').subscribe(data => {
      this.planArr = data;
      this.selectPlan = data[0].id;
      this.plan_id = data[0].id;
      console.log(data[0].id);
  });
  }

  deleteSubscriptionItem(id : any){
    console.log("company id : " + id);
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
        const body = {company_id: id};
    return this.http.post('https://seekproduct-api.misavu.net/api/user/subscription/cancel-plan',body, {
      headers: new HttpHeaders({ 
        Authorization: 'JWT ' + localStorage.getItem('TOKEN'),
        }),    
        }).subscribe( (data)=>{
          console.log(data);
          this.spinner.hide();
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'You delete Success',
            showConfirmButton: false,
            timer: 1500
          });
          this.subscriptionItems = this.subscriptionItems.filter(item => item.company.id != id);
        }, err => {
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
  openDialog(){
    this.checkEdit = false;
    this.selectCompany = this.company[0].id;
    this.selectPlan = this.planArr[0].id;
    this.http.get<any>('https://seekproduct-api.misavu.net/api/user/payment/check-payment-source',{
        headers: new HttpHeaders({
          Authorization: 'JWT ' + localStorage.getItem('TOKEN')
        })}).subscribe((data)=>{
          if(data.source == true){
            this.show = !this.show;            
          } else if(data.source == false){
            Swal.fire({
              position: 'center',
              icon: 'warning',
              title: 'Payment source does not exist.',
              showConfirmButton: false,
              timer: 1500
            });
          }
        });
  }
  changeData (event : any){
    this[event.target.id] = event.target.value;
    console.log(event.target.id + ": " + this[event.target.id]);
    if(event.target.id == 'company_id'){
        for(var i = 0; i < this.subscriptionItems.length ; i++){
          if(this.subscriptionItems[i].company.id == event.target.value){
            console.log(this.subscriptionItems[i].company.id);
            this.err = true;
            break;
          }
          else {
            this.err = false;
          }
        }
      };
    
  }
  submit(){
    console.log(this.item);
    if(this.checkEdit === false){
      this.spinner.show();
      this.company.forEach((value,key)=>{
        if(value.id == this.company_id){
          console.log(value);
          this.item.company.id = value.id;
          this.item.company.address = value.address;
          this.item.company.logo = value.logo;
          this.item.company.store_name = value.store_name;
          this.item.company.phone_number = value.phone_number;
        } 
      });
      this.planArr.forEach((value,key)=>{
        if(value.id == this.plan_id){
          console.log(value);
          this.item.plan.id = value.id;
          this.item.plan.name = value.name;
          this.item.plan.price = value.price;
        }
      });
      this.item.company_id = parseInt(this.company_id);
      this.item.plan_id = this.plan_id;
      this.item.trial_period_days = this.trial_period_days;
      this.http.post('https://seekproduct-api.misavu.net/api/user/subscription/', this.item,{
        headers: new HttpHeaders({ 
          Authorization: `JWT ${localStorage.getItem('TOKEN')}`
      })
      }).subscribe((data)=>{
        console.log(data);
        this.http.get<any>('https://seekproduct-api.misavu.net/api/user/subscription/', {
          headers: new HttpHeaders({
          Authorization:`JWT ${localStorage.getItem('TOKEN')}`
              }),
            }).subscribe((data)=>{
              this.subscriptionItems = data
              this.spinner.hide();
              Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'You Add Success',
                showConfirmButton: false,
                timer: 1500
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
      this.item = {company:{id:0,address:'',logo:'',phone_number:'',store_name:''}, 
        company_id:0,plan_id:'', trial_period_days:'',plan:{id:0,name:'',price:0}};
    } else if(this.checkEdit === true){
              this.item.company_id = parseInt(this.company_id);
              this.item.plan_id = this.plan_id;
              this.item.trial_period_days = this.trial_period_days;
              this.planArr.forEach((value2,key)=>{
                if(value2.id == this.plan_id){
                  this.item.plan = value2;
                }
              });
              this.company.forEach((value,key)=>{
                if(value.id == this.company_id){
                  this.item.company = value;
                }
              });
              Swal.fire({
                title: 'Are you sure?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, Update it!'
              }).then((result) => {
                if (result.value) {
                  this.spinner.show();
                  this.http.post('https://seekproduct-api.misavu.net/api/user/subscription/change-plan',this.item,{
                    headers: new HttpHeaders({ 
                    Authorization: 'JWT ' + localStorage.getItem('TOKEN')
                    })
                    }).subscribe((data)=>{
                      console.log(data);
                      this.http.get<any>('https://seekproduct-api.misavu.net/api/user/subscription/', {
                          headers: new HttpHeaders({
                            Authorization:`JWT ${localStorage.getItem('TOKEN')}`
                          }),
                        }).subscribe((data)=>{
                          this.subscriptionItems = data
                          this.spinner.hide();
                          Swal.fire({
                            position: 'center',
                            icon: 'success',
                            title: 'You Update Success',
                            showConfirmButton: false,
                            timer: 1500
                          });
                        });
                    }, err => {
                      this.spinner.hide();
                      Swal.fire({
                        position: 'center',
                        icon: 'error',
                        title: 'You delete FAIL\n',
                        showConfirmButton: false,
                        timer: 1500
                      });
                    });
                  this.item = {company:{id:0,address:'',logo:'',phone_number:'',store_name:''}, 
                        company_id:0,plan_id:'', trial_period_days:'',plan:{id:0,name:'',price:0}};
                }
              });     
              this.checkEdit = false;
            }
            this.company_id = '';
            this.plan_id = '';
            this.trial_period_days = '';
            this.show = false;
  }

  selectPlan : number;
  selectCompany : number;
  EditSubscriptionItem(id : any){
    console.log(id);
    this.checkEdit = true;
    this.subscriptionEdit = this.subscriptionItems.filter(item => item.id == id)[0];
    this.selectPlan = this.subscriptionEdit.plan.id;
    this.selectCompany =this.subscriptionEdit.company.id;
    this.company_id =this.subscriptionEdit.company.id + '';
    this.show = true;
    console.log(this.subscriptionEdit);
  }
}

