import { Component, OnInit, ViewChild, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { StripeService, StripeCardComponent } from 'ngx-stripe';
import {
  StripeCardElementOptions,
  StripeElementsOptions
} from '@stripe/stripe-js';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-card-element',
  templateUrl: './card-element.component.html',
  styleUrls: ['./card-element.component.css']
})
export class CardElementComponent implements OnInit, OnChanges {

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
  constructor(private fb: FormBuilder, private stripeService: StripeService, private http: HttpClient) { }

  ngOnInit(): void {

  }
  name = '';
  changeName(event: any) {
    this.name = event.target.value;
  }

  createToken(): void {
    const name = this.name;
    this.stripeService
      .createToken(this.card.element)
      .subscribe((result) => {
        console.log(result);
        if (result.token) {
          // Use the token
          console.log(result.token.id);
        } else if (result.error) {
          // Error creating the token
          console.log(result.error.message);
        }
      });
  }
  createBankToken(): void {
    const headers = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Bearer pk_test_51H7ucuBSqfqN5GAzJP9NIWvCdc2vG5wd5K0O1cwIJzkruVsb4qWkzYODfCXlb5s1MRoDHXFLXRVMOkhkmZKBuTqf00km4iDv7w'
      })
    }
    const bankAccount = {
      'bank_account[country]': this.country,  //us
      'bank_account[currency]': this.currency,    //usd
      'bank_account[account_holder_name]': this.account_holder_name,
      'bank_account[account_holder_type]': this.account_holder_type,  //individual
      'bank_account[routing_number]': this.routing_number,   //110000000
      'bank_account[account_number]': this.account_number    //000123456789
    };
    this.http.post<any>('https://api.stripe.com/v1/tokens', Object.keys(bankAccount)
      .map(key => key + '=' + bankAccount[key])
      .join('&')
      , {
        headers: new HttpHeaders({
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: 'Bearer pk_test_51H7ucuBSqfqN5GAzJP9NIWvCdc2vG5wd5K0O1cwIJzkruVsb4qWkzYODfCXlb5s1MRoDHXFLXRVMOkhkmZKBuTqf00km4iDv7w'
        })
      }).subscribe(res => console.log(res.id));
  }
  showcard: boolean = false;
  @Input() showCard: boolean;
  // showCard(){
  //   this.showcard = !this.showcard;
  // }
  ngOnChanges(): void {
    // console.log(this.showCard);
    if (this.showCard === false)
      this.local = 0;
    // console.log(this.local);
  }

  account_holder_name = '';
  country = '';
  currency = '';
  account_holder_type = '';
  routing_number = '';
  account_number = '';
  
  changeNumber(event: any) {
    this[event.target.id] = event.target.value;
    //  console.log(event.target.value);
  }

  local = 0;
  location(event: any) {
    if (event.target.value == 0) {
      this.local = 0;
    } else if (event.target.value == 1) {
      this.local = 1;
    }
    // console.log(this.local);
  }
}
