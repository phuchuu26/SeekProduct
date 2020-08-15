import { Component, OnInit, ElementRef } from "@angular/core";
import { ROUTES } from "../sidebar/sidebar.component";
import {
  Location,
  LocationStrategy,
  PathLocationStrategy,
} from "@angular/common";
import { Router, Route } from "@angular/router";
import { ServerHttpService } from "src/app/Services/server-http.service";
import { SnotifyService, SnotifyPosition } from "ng-snotify";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"],
})
export class NavbarComponent implements OnInit {
  public focus;
  // public listTitles: any[];
  public location: Location;
  public menuItems: any[];
  constructor(
    location: Location,
    private element: ElementRef,
    private router: Router,
    private snotify: SnotifyService,
    private service_http: ServerHttpService
  ) {
    this.location = location;
  }
  public listTitles = [
    { path: '/dashboard', title: 'Dashboard',  icon: 'ni-tv-2 text-primary', class: '' },
    { path: '/icons', title: 'Icons',  icon:'ni-planet text-blue', class: '' },
    { path: '/maps', title: 'Maps',  icon:'ni-pin-3 text-orange', class: '' },
    { path: '/user-profile', title: 'User profile',  icon:'ni-single-02 text-yellow', class: '' },
    { path: '/tables', title: 'Tables',  icon:'ni-bullet-list-67 text-red', class: '' },
    // { path: '/login', title: 'Login',  icon:'ni-key-25 text-info', class: '' },
    { path: '/updatePassword', title: 'Update Password',  icon:'ni-circle-08 text-pink', class: '' }
  ];
  ngOnInit() {

  }
  getTitle() {

    var titlee = this.location.prepareExternalUrl(this.location.path());
    if (titlee.charAt(0) === "#") {
      titlee = titlee.slice(1);
    }

    for (var item = 0; item < this.listTitles.length; item++) {
      if (this.listTitles[item].path === titlee) {
        return this.listTitles[item].title;
      }
    }
    return "Dashboard";
  }

  getIcon() {

    var titlee = this.location.prepareExternalUrl(this.location.path());
    if (titlee.charAt(0) === "#") {
      titlee = titlee.slice(1);
    }

    for (var item = 0; item < this.listTitles.length; item++) {
      if (this.listTitles[item].path === titlee) {
        return this.listTitles[item].icon;
      }
    }
    return "Dashboard";
  }
  public logout() {
    this.service_http.logout().subscribe((data) => {
      console.log(data);
    });
    this.router.navigate(["login"]);
    this.successLogout();
  }

  public successLogout() {
    this.snotify.info(`Đã đăng xuất thành công`, "Xác nhận", {
      position: SnotifyPosition.rightTop,
      timeout: 3000,
      showProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
    });
  }
}
