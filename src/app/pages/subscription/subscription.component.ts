import { Component, OnInit } from '@angular/core';
import {AppState} from '../store/models/app-state.model';
import {Subscription} from '../store/models/subscription.model';
import { LoadSubscriptionAction, DeleteSubscriptionAction, AddSubscriptionAction, UpdateSubscriptionAction } from '../store/actions/subscription.action';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { from } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { ServerHttpService } from 'src/app/Services/server-http.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.css']
})
export class SubscriptionComponent implements OnInit {
  subscriptionItems: Observable<Array<Subscription>>;
  loading$: Observable<Boolean>;
  error$: Observable<Error>
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
    private httpServer: ServerHttpService) { }

    resset(){
      this.subscriptionItems = this.store.select(store => store.user.list);
      this.loading$ = this.store.select(store => store.user.loading);
      this.error$ = this.store.select(store => store.user.error);
      this.store.dispatch(new LoadSubscriptionAction());
      this.subscriptionItems.subscribe(data => console.log(data));
    }
  ngOnInit() {
    this.subscriptionItems = this.store.select(store => store.user.list);
    this.loading$ = this.store.select(store => store.user.loading);
    this.error$ = this.store.select(store => store.user.error);
    this.store.dispatch(new LoadSubscriptionAction());
    this.subscriptionItems.subscribe(data => console.log(data));
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
        this.store.dispatch(new DeleteSubscriptionAction(id));
      }
    });
    
  }
  openDialog(){
    this.show = !this.show;
  }
  changeData (event : any){
    this[event.target.id] = event.target.value;
    console.log(event.target.id + ": " + this[event.target.id]);
    if(event.target.id == 'company_id'){
      this.subscriptionItems.subscribe(data => {

        for(var i = 0; i < data.length ; i++){
          if(data[i].company.id == event.target.value){
            console.log(data[i].company.id);
            this.err = true;
            break;
          }
          else {
            this.err = false;
          }
        }
        // data.forEach((value : any,key)=> {
        //   if(value.company.id == event.target.value){
        //     this.err = true;
        //   }
        // });
      });
    }
  }
  submit(){
    console.log(this.item);
    if(this.checkEdit === false){
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
      this.store.dispatch(new AddSubscriptionAction(this.item));
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
                  this.store.dispatch(new UpdateSubscriptionAction(this.item));
                  this.item = {company:{id:0,address:'',logo:'',phone_number:'',store_name:''}, 
                        company_id:0,plan_id:'', trial_period_days:'',plan:{id:0,name:'',price:0}};
                }
              });     
              this.checkEdit = false;
            }
             
            this.company_id = '';
            this.plan_id = '';
            this.trial_period_days = '';
            this.openDialog();
  }

  selectPlan : number;
  selectCompany : number;
  EditSubscriptionItem(id : any){
    console.log(id);
    this.checkEdit = true;
    this.subscriptionItems.subscribe(data => {
      data.forEach((value : any,key)=> {
        if(value.id == id){
          this.subscriptionEdit = value;
        }
      });
    });
    this.selectPlan = this.subscriptionEdit.plan.id;
    this.selectCompany =this.subscriptionEdit.company.id;
    this.company_id =this.subscriptionEdit.company.id + '';

    if(this.show === false){
      this.openDialog();
    }
    console.log(this.subscriptionEdit);
  }
}

