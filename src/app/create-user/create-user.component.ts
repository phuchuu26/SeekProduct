import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AppState } from '../store/models/app-state.model';
import { Users } from '../store/models/users.model';
import { AddUsersAction, UpdateUsersAction } from '../store/actions/users.actions';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import Swal from 'sweetalert2'
@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent implements OnInit {
  check = false;
  input = false;
  id : string = '';
  fullname: string = '';
  email: string = '';
  phone: number = 0;
  avatar: string = '';
  address: string = '';
  password: string = '';
  urlImage: string = '';
  ConfirmPassword: string = '';
  status: boolean = false;
  @Input() userEdit: Users;
  @Output() onSubmit = new EventEmitter();
  constructor(private store: Store<AppState>) { }
  showForm() {
    console.log("đã chạy");
    this.check = !this.check;
    if (this.check === false) {
      this.fullname = '';
      this.email = '';
      this.phone = 0;
      this.address = '';
      this.urlImage = '';
      this.password = '';
      this.ConfirmPassword = '';
      this.error = {fullname : '', email: '', address: '', phone: '',password: '', ConfirmPassword: '', checkpass : false};
      this.user = {
        id: null,
        fullname: '',
        email: '',
        password: '',
        avatar: '',
        address: '',
        phone: 0,
        status: true
      };
      this.userEdit = {
        id: null,
        fullname: '',
        email: '',
        password: '',
        avatar: '',
        address: '',
        phone: 0,
        status: true
      };
    }
  }
  onclick() {
    this.input = !this.input;
    console.log(this.userEdit);
  }
  changeData(event: any) {
    this.fullname = event.target.value;
    this[event.target.id] = event.target.value;
    console.log(event.target.id + ": " + this[event.target.id]);
    if(this[event.target.id].length < 1){
      this.error[event.target.id] = 'err';
    }else this.error[event.target.id] = '';
  }
  changeStatus() {
     this.status = !this.status;
  }
  base64textString: string;
  handleReaderLoaded(e) {
    this.base64textString = 'data:image/png;base64,' + btoa(e.target.result);
    console.log('data:image/png;base64,' + btoa(e.target.result));
    this.urlImage = 'data:image/png;base64,' + btoa(e.target.result);
  }
  changeAvatar(event: any) {
    if(this.location === 0){
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = this.handleReaderLoaded.bind(this);
      reader.readAsBinaryString(file);
      console.log(this.base64textString);
    }
  }
  else {
    // this.base64(event.target.value + '');
    this.urlImage = event.target.value;
  }
  }
  user: Users = {
    id: null,
    fullname: '',
    email: '',
    password: '',
    avatar: '',
    address: '',
    phone: 0,
    status: true
  };

  error = {fullname : '', email: '', address: '', phone: '',password: '', ConfirmPassword: '', checkpass : false};
  
  Submit() {
    var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if(this.fullname.length < 1){
      this.error.fullname = 'err';
    }else this.error.fullname = '';

    if(this.email.length < 1){
      this.error.email = 'err';
    }else this.error.email = '';

    if(this.address.length < 1){
      this.error.address = 'err';
    }else this.error.address = '';

    if(this.phone < 1){
      this.error.phone = 'err';
    }else this.error.phone = '';

    if(this.password.length < 1){
      this.error.password = 'err';
    }else this.error.password = '';

    if(this.ConfirmPassword.length < 1){
      this.error.ConfirmPassword = 'err';
    }else this.error.ConfirmPassword = '';

    if(this.password !== this.ConfirmPassword){
      this.error.checkpass = true;
    }else this.error.checkpass = false;

    if(this.error.fullname === '' && this.error.email === '' && this.error.address === '' && this.error.phone === '' &&
    this.error.password === '' && this.error.ConfirmPassword === '' && this.error.checkpass === false ){
      this.user.fullname = this.fullname;
      this.user.email = this.email;
      this.user.password = this.password;
      this.user.phone = this.phone;
      this.user.avatar = this.urlImage;
      this.user.address = this.address;
      this.user.status = this.status;
      if(this.userEdit.id === null){
        this.user.id = null;
        this.store.dispatch(new AddUsersAction(this.user));
        this.showForm();
      } else if(this.userEdit.id !== null){
                this.user.id = this.userEdit.id;
                Swal.fire({
                  title: 'Are you sure?',
                  icon: 'warning',
                  showCancelButton: true,
                  confirmButtonColor: '#3085d6',
                  cancelButtonColor: '#d33',
                  confirmButtonText: 'Yes, Update it!'
                }).then((result) => {
                  if (result.value) {
                    this.store.dispatch(new UpdateUsersAction(this.user));
                    }
                    });
                
      }
     // this.onSubmit.emit();
      
    }
  }
  ngOnInit(): void {

  }
  ngOnChanges(): void {
    console.log("change");
    console.log("User : " + this.userEdit.id);
    var res = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;
    if (this.userEdit.id !== null) {
      this.fullname = this.userEdit.fullname;
      this.email = this.userEdit.email;
      this.phone = this.userEdit.phone;
      this.address = this.userEdit.address;
      this.avatar = this.userEdit.avatar;
      this.urlImage = this.userEdit.avatar;
      this.password = this.userEdit.password;
      this.ConfirmPassword = this.userEdit.password;
      this.status = this.userEdit.status;
      this.showForm();
    }
  }
  options = {
    componentRestrictions: {
      country: ['VN']
    }
  }
  formatAddress = '';
  public handleAddressChange(address: any) {
    this.formatAddress = address.formatted_address;
    console.log(this.formatAddress);
    this.address = this.formatAddress;
  }
  
  location = 0;
  locationImg(event : any) {
    if(event.target.value == 0){
      this.location = 0;
    }else if(event.target.value == 1) this.location = 1;
    console.log(this.location);
   }

   @Input() showCreate: boolean;
}
