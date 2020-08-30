import { EditBannerComponent } from './../../pages/Company/edit-banner/edit-banner.component';
import { Routes } from '@angular/router';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { IconsComponent } from '../../pages/icons/icons.component';
import { MapsComponent } from '../../pages/maps/maps.component';
import { UserProfileComponent } from '../../pages/user-profile/user-profile.component';
import { TablesComponent } from '../../pages/tables/tables.component';
import {SubscriptionComponent} from '../../pages/subscription/subscription.component';
import {ManageProductComponent} from '../../pages/manage-product/manage-product.component';
import { ManageProductGroupComponent } from '../../pages/manage-product-group/manage-product-group.component';
import { OrderComponent } from '../../pages/order/order.component';
import { CartComponent } from '../../pages/cart/cart.component';
import { ReviewComponent } from '../../pages/review/review.component';

import { UpdatePasswordComponent } from 'src/app/pages/update-password/update-password.component';
import { IndexCompanyComponent } from 'src/app/pages/Company/index-company/index-company.component';
import { DetailCompanyComponent } from 'src/app/pages/Company/detail-company/detail-company.component';
import { CreateCompanyComponent } from 'src/app/pages/Company/create-company/create-company.component';
import { VerificationCompanyComponent } from 'src/app/pages/Company/verification-company/verification-company.component';
export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard',      component: DashboardComponent },
    { path: 'user-profile',   component: UserProfileComponent },
    { path: 'tables',         component: TablesComponent },
    { path: 'icons',          component: IconsComponent },
    { path: 'maps',           component: MapsComponent },
    { path: 'subscription',   component: SubscriptionComponent },
    { path: 'products',   component: ManageProductComponent },
    { path: 'product_group',   component: ManageProductGroupComponent },
    { path: 'updatePassword', component: UpdatePasswordComponent },
    { path: 'allmycompany', component: IndexCompanyComponent },
    { path: 'detailcompany/:id', component: DetailCompanyComponent },
    { path: 'addcompany', component: CreateCompanyComponent },
    { path: 'order', component: OrderComponent },
    { path: 'editBanner/:id', component: EditBannerComponent },
    { path: 'cart', component: CartComponent },
    { path: 'review', component: ReviewComponent },
    { path: 'verification/:id', component: VerificationCompanyComponent }

];
