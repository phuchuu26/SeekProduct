import { UpdatePasswordComponent } from 'src/app/pages/update-password/update-password.component';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ClipboardModule } from 'ngx-clipboard';

import { AdminLayoutRoutes } from './admin-layout.routing';
import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { IconsComponent } from '../../pages/icons/icons.component';
import { MapsComponent } from '../../pages/maps/maps.component';
import { UserProfileComponent } from '../../pages/user-profile/user-profile.component';
import { TablesComponent } from '../../pages/tables/tables.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {SubscriptionComponent} from '../../pages/subscription/subscription.component';
import {ManageProductComponent} from '../../pages/manage-product/manage-product.component';
import {ManageProductGroupComponent} from '../../pages/manage-product-group/manage-product-group.component';
import {DialogOverviewExampleDialog} from '../../pages/manage-product/manage-product.component';
import { OrderComponent } from '../../pages/order/order.component';
import { CartComponent } from '../../pages/cart/cart.component';
import { ReviewComponent } from '../../pages/review/review.component';
import { NgxStripeModule } from 'ngx-stripe';
import {NgxPaginationModule} from 'ngx-pagination';
// import { CustomFormsModule } from 'ngx-custom-validators';
// import { ToastrModule } from 'ngx-toastr';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { SubscriptionEffects } from '../../pages/store/effects/subscription.effects';
import { SubscriptionReducer } from '../../pages/store/reducers/subscription.reducers';
import {MatTabsModule} from '@angular/material/tabs';
import {MatSelectModule} from '@angular/material/select';
import {MatDialogModule} from '@angular/material/dialog';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSliderModule} from '@angular/material/slider';
import { ColorPickerModule } from 'ngx-color-picker';
import { NgxSpinnerModule } from "ngx-spinner";
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    HttpClientModule,
    NgbModule,
    ClipboardModule,
    ReactiveFormsModule,
    EffectsModule.forRoot([SubscriptionEffects]),
    StoreModule.forRoot({
      user : SubscriptionReducer
    }),
    MatTabsModule,
    MatSelectModule,
    MatDialogModule,
    NgxPaginationModule,
    MatProgressSpinnerModule,
    MatSliderModule,
    ColorPickerModule,
    NgxSpinnerModule,
    NgxStripeModule.forRoot('pk_test_7X4at47jVmUqka7N8HhdO35N') 
    // CustomFormsModule
  ],
  declarations: [
    DashboardComponent,
    UserProfileComponent,
    TablesComponent,
    IconsComponent,
    MapsComponent,
    SubscriptionComponent,
    ManageProductComponent,
    DialogOverviewExampleDialog,
    ManageProductGroupComponent,
    OrderComponent,
    CartComponent,
    UpdatePasswordComponent,
    ReviewComponent
  ]
})

export class AdminLayoutModule {}
