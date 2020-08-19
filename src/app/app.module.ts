import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
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
    SnotifyModule

  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    AuthLayoutComponent,
    IndexCompanyComponent,
    EditCompanyComponent,
    CreateCompanyComponent,
    DetailCompanyComponent,
  ],
  providers: [
    { provide: 'SnotifyToastConfig', useValue: ToastDefaults},
    SnotifyService,

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
