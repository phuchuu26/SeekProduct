import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Subscription} from '../store/models/subscription.model';
import { ServerHttpService } from 'src/app/Services/server-http.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  private Subscription_URL = "https://seekproduct-api.misavu.net/api/user/subscription/"
  getSubscriptionItem() {
    return this.http.get<Array<Subscription>>(this.Subscription_URL, {
            headers: new HttpHeaders({
              // Accept: "application/json",
              // "Content-Type": "application/json",
              Authorization:`JWT ${localStorage.getItem('TOKEN')}`
            }),
          });
  }
  deleteSubscriptionItem(id: number) {
    console.log("JWT " +this.httpServer.tokenLogin);
  const body = {company_id: id};
    return this.http.post(`${this.Subscription_URL}cancel-plan`,body, {
      headers: new HttpHeaders({ 
        Authorization: `JWT ${localStorage.getItem('TOKEN')}`
    }), 
      
  });
  }

  addSubscriptionItem(SubscriptionItem: any) {
    return this.http.post(this.Subscription_URL, SubscriptionItem,{
      headers: new HttpHeaders({ 
        Authorization: `JWT ${localStorage.getItem('TOKEN')}`
    })
    });
  }

  UpdateSubscriptionItem(Subscription: Subscription) {
    console.log(Subscription);
    const bodyUp = {company_id : Subscription.company_id+'', plan_id : Subscription.plan_id, trial_period_days: Subscription.trial_period_days};
    return this.http.post(`${this.Subscription_URL}change-plan`,Subscription,{
      headers: new HttpHeaders({ 
        Authorization: `JWT ${localStorage.getItem('TOKEN')}`
    })
    });
  }
  constructor(
    private http: HttpClient,
    private httpServer: ServerHttpService
  ) { }
}
