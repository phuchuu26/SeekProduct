import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EffectsModule } from '@ngrx/effects';
import { HttpClientModule } from '@angular/common/http';
import { UsersEffects } from './store/effects/users.effects';
import { FormsModule } from '@angular/forms';
import { UsersReducer } from './store/reducers/users.reducers';
import {NgxPaginationModule} from 'ngx-pagination';
import { CreateUserComponent } from './create-user/create-user.component';
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import { CardElementComponent } from './card-element/card-element.component';
import { NgxStripeModule } from 'ngx-stripe';
import {ReactiveFormsModule} from '@angular/forms';
import { from } from 'rxjs';
@NgModule({
  declarations: [
    AppComponent,
    CreateUserComponent,
    CardElementComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule,
    EffectsModule.forRoot([UsersEffects]),
    FormsModule,
    HttpClientModule,
    StoreModule.forRoot({
      user : UsersReducer
    }),
    NgxPaginationModule,
    GooglePlaceModule,
    NgxStripeModule.forRoot('pk_test_51H7ucuBSqfqN5GAzJP9NIWvCdc2vG5wd5K0O1cwIJzkruVsb4qWkzYODfCXlb5s1MRoDHXFLXRVMOkhkmZKBuTqf00km4iDv7w')
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
