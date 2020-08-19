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
// import { CustomFormsModule } from 'ngx-custom-validators';
// import { ToastrModule } from 'ngx-toastr';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { SubscriptionEffects } from '../../pages/store/effects/subscription.effects';
import { SubscriptionReducer } from '../../pages/store/reducers/subscription.reducers';

import {MatSliderModule} from '@angular/material/slider';
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
    MatSliderModule
    // CustomFormsModule
  ],
  declarations: [
    DashboardComponent,
    UserProfileComponent,
    TablesComponent,
    IconsComponent,
    MapsComponent,
    SubscriptionComponent,
    UpdatePasswordComponent,

  ]
})

export class AdminLayoutModule {}
