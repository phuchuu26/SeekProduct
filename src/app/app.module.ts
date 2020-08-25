import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './components/components.module';
// import { CustomFormsModule } from 'ngx-custom-validators';
import { ReactiveFormsModule } from '@angular/forms';
import { SnotifyModule, SnotifyService, ToastDefaults } from 'ng-snotify';
import { IndexCompanyComponent } from './pages/Company/index-company/index-company.component';
import { EditCompanyComponent } from './pages/Company/edit-company/edit-company.component';
import { CreateCompanyComponent } from './pages/Company/create-company/create-company.component';
import { DetailCompanyComponent } from './pages/Company/detail-company/detail-company.component';


import { MatSliderModule } from '@angular/material/slider';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { MatInputModule } from '@angular/material/input';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatSelectModule} from '@angular/material/select';
import {NgbPaginationModule, NgbAlertModule,} from '@ng-bootstrap/ng-bootstrap';
@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    ComponentsModule,
    NgbModule,
    RouterModule,
    AppRoutingModule,
    // CustomFormsModule,
    ReactiveFormsModule,
    SnotifyModule,

    MatSliderModule,
    MatToolbarModule,
    MatIconModule,
    MatBadgeModule,
    MatInputModule,
    MatSidenavModule,
    MatListModule,
    MatButtonModule,
    MatAutocompleteModule,
    MatProgressBarModule,
    MatSelectModule,

    NgbPaginationModule,
    NgbAlertModule

  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    AuthLayoutComponent,
    IndexCompanyComponent,
    EditCompanyComponent,
    CreateCompanyComponent,
    DetailCompanyComponent


    // MatSliderModule,
    // MatToolbarModule,
    // MatIconModule,
    // MatBadgeModule,
    // MatInputModule,
    // MatSidenavModule,
    // MatListModule,
    // MatButtonModule,
    // MatAutocompleteModule,
    // MatProgressBarModule
  ],
  providers: [
    { provide: 'SnotifyToastConfig', useValue: ToastDefaults},
    SnotifyService,

  ],
  bootstrap: [AppComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule { }
