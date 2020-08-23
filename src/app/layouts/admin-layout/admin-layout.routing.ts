import { Routes } from '@angular/router';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { IconsComponent } from '../../pages/icons/icons.component';
import { MapsComponent } from '../../pages/maps/maps.component';
import { UserProfileComponent } from '../../pages/user-profile/user-profile.component';
import { TablesComponent } from '../../pages/tables/tables.component';
import {SubscriptionComponent} from '../../pages/subscription/subscription.component';
import {ManageProductComponent} from '../../pages/manage-product/manage-product.component';
import { ManageProductGroupComponent } from '../../pages/manage-product-group/manage-product-group.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard',      component: DashboardComponent },
    { path: 'user-profile',   component: UserProfileComponent },
    { path: 'tables',         component: TablesComponent },
    { path: 'icons',          component: IconsComponent },
    { path: 'maps',           component: MapsComponent },
    { path: 'subscription',   component: SubscriptionComponent },
    { path: 'products',   component: ManageProductComponent },
    { path: 'product_group',   component: ManageProductGroupComponent },
];
