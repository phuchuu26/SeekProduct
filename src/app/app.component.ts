import { Component, OnInit } from '@angular/core';
import { AppState } from './store/models/app-state.model';
import { Users } from './store/models/users.model';
import { LoadUsersAction, DeleteUsersAction, UpdateUsersAction } from './store/actions/users.actions';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import Swal from 'sweetalert2'
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'StoreComponentUser';
  p: number = 1;
  numberUser = 0;
  numberUserActive = 0;
  numberUserDeactive = 0;
  ratioActive: number = 0;
  UserItems: Observable<Array<Users>>;
  loading$: Observable<Boolean>;
  error$: Observable<Error>
  userEdit: Users = {id: null,
  fullname: '',
  email: '',
  password: '',
  avatar: '',
  address: '',
  phone: 0,
  status: true};
  constructor(private store: Store<AppState>) { }
  length = 0;
  
  resetData() {
    console.log("lần");
    this.UserItems.subscribe(result => {
      this.numberUser = 0;
      this.numberUserActive = 0;
      this.numberUserDeactive = 0;
      console.log("result : " + result.length);
      for (var i = 0; i < result.length; i++) {
        if (result[i].status === true) {
          this.numberUserActive++;
        }
        if (result[i].status === false) {
          this.numberUserDeactive++;
        }
      }
      this.numberUser = result.length;
      this.ratioActive = parseFloat(((this.numberUserActive * 100) / this.numberUser).toFixed(2));
    });
  }
  ngOnInit() {
    this.UserItems = this.store.select(store => store.user.list);
    this.loading$ = this.store.select(store => store.user.loading);
    this.error$ = this.store.select(store => store.user.error);
    this.store.dispatch(new LoadUsersAction());
    this.resetData();
  }
  deleteUserItem(id: number) {
    
    //this.resetData();
    Swal.fire({
      title: 'Are you sure?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        this.store.dispatch(new DeleteUsersAction(id));
        }
        });
  }
  EditUser(id: number) {
    this.UserItems.subscribe(result => {
      for (var i = 0; i < result.length; i++) {
        if (result[i].id === id) {
          this.userEdit = result[i];
          break;
        }
      }
    });
    console.log(this.userEdit);
  }

  onSubmit() {
    console.log("đã submit");
    
  }
  userStatus : Users = {
    id: null,
    fullname: '',
    email: '',
    password: '',
    avatar: '',
    address: '',
    phone: 0,
    status: true
  };
  changeStatus(id : number){
    this.UserItems.subscribe(result => {
      for (var i = 0; i < result.length; i++) {
        if (result[i].id === id) {
          this.userStatus.address = result[i].address;
          this.userStatus.avatar = result[i].avatar;
          this.userStatus.email = result[i].email;
          this.userStatus.fullname = result[i].fullname;
          this.userStatus.id = result[i].id;
          this.userStatus.password = result[i].password;
          this.userStatus.phone = result[i].phone;
          this.userStatus.status = !result[i].status;
          break;
        }
      }
    });
    console.log(this.userStatus.status);
    this.store.dispatch(new UpdateUsersAction(this.userStatus));
  }
  showCreate = false;
  showCard = false;
  showcard(){
    this.showCard = !this.showCard;
    console.log(this.showCard);
  }
  showcreate(){
    this.showCreate = !this.showCreate;
  }

}
