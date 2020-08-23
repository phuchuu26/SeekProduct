import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2';

interface ProductGroup {
  company: string;
  name: string;
  info: string;
}

@Component({
  selector: 'app-manage-product-group',
  templateUrl: './manage-product-group.component.html',
  styleUrls: ['./manage-product-group.component.css']
})
export class ManageProductGroupComponent implements OnInit {

  constructor(private http : HttpClient) { }
  check : boolean = false;
  productGroup_Full_list = [];
  productGroup_list = [];
  page : number = 1;
  my_company = [];
  selectedValue : string = '';
  selectCompany : string = '';
  company_id : string = '';
  name : string = '';
  info: string = '';
  product_Group_ID : string = '';
  pageChanged(event : any){
    this.page = event;
  }
 async Product_Group_List(){
    let count = 0;
    let temp = [];
    await this.http.get<any>('https://seekproduct-api.misavu.net/api/user/productgroup/?page=' + 1, {
      headers: new HttpHeaders({
        Authorization: 'JWT ' + localStorage.getItem('TOKEN'),
      })
    }).subscribe(async (data) => {
      count = data.count;
      for (var a = 0; a < data.results.length; a++) {
        temp[temp.length] = data.results[a];
      }
      var j = 2;
      for (var i = 10; i < count; i = i + 10) {
        this.http.get<any>('https://seekproduct-api.misavu.net/api/user/productgroup/?page=' + j, {
          headers: new HttpHeaders({
            Authorization: 'JWT ' + localStorage.getItem('TOKEN'),
          })
        }).subscribe((res) => {
          for (var b = 0; b < res.results.length; b++) {
            temp[temp.length] = res.results[b];
          }
        });
        j++;
      }
      await console.log(temp);
      this.productGroup_list = await temp;
      this.productGroup_Full_list = await temp;
    });
  }
  ngOnInit(): void {
    this.Product_Group_List();
    this.selectedValue = 'full_company';
    this.http.get<any>('https://seekproduct-api.misavu.net/api/user/company/my-company/', {
      headers: new HttpHeaders({
        Authorization: 'JWT ' + localStorage.getItem('TOKEN'),
      })
    }).subscribe((data)=>{
      console.log(data.results);
        this.my_company = data.results;
    });
  }
  openDialog(){
    this.err = false;
    this.checkEdit = false;
    this.selectCompany = this.my_company[0].id;
    this.info = '';
    this.name = '';
  }
  changeData(event : any){
    console.log(event.value);
    if(event.value == 'full_company'){
      this.productGroup_list = this.productGroup_Full_list;
    }else this.productGroup_list = this.productGroup_Full_list.filter(item =>item.company == event.value);
  }
  onChange(event : any){
    console.log(event.target.id + ": " + event.target.value);
    this[event.target.id] = event.target.value;
  }
  deleteProductGroup(id : any){
    Swal.fire({
      title: 'Are you sure?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        this.http.delete<any>('https://seekproduct-api.misavu.net/api/user/productgroup/'+id+'/', {
          headers: new HttpHeaders({
            Authorization: 'JWT ' + localStorage.getItem('TOKEN')
          }),
          observe: 'response'
        }).subscribe((event : any) => {
          console.log(event.status);
          if (event.status == 204) {
            this.productGroup_list = this.productGroup_list.filter(item => item.id !== id);
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'You delete Success',
              showConfirmButton: false,
              timer: 1500
            });
          } else if (event.status == 200) {
            Swal.fire({
              position: 'center',
              icon: 'error',
              title: 'You delete FAIL\n' + event.message,
              showConfirmButton: false,
              timer: 1500
            });
          }
        }, err =>{
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'You delete FAIL\n',
            showConfirmButton: false,
            timer: 1500
          });
        });
      }
    });
  }

  submit(){
    console.log("okok");
    
    if(this.checkEdit === true){
      const proUpdate = {name: this.name, info: this.info};
      console.log();
      this.http.put<any>('https://seekproduct-api.misavu.net/api/user/productgroup/'+this.product_Group_ID+'/', proUpdate, {
            headers: new HttpHeaders({
              Authorization: 'JWT ' + localStorage.getItem('TOKEN')
            })
          }).subscribe((data)=>{
            console.log(data);
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'You Update Success',
              showConfirmButton: false,
              timer: 1500
            });
            this.productGroup_Full_list.forEach((value)=>{
              if(value.id == data.id){
                value.name = data.name;
                value.info = data.info;
              }
            });
            this.productGroup_list.forEach((value)=>{
              if(value.id == data.id){
                value.name = data.name;
                value.info = data.info;
              }
            });
          }, err => {
            Swal.fire({
              position: 'center',
              icon: 'error',
              title: 'You Update FAIL\n',
              showConfirmButton: false,
              timer: 1500
            });
          }
          );
    } else {
      const pro : ProductGroup = {company: this.company_id, name: this.name, info:this.info};
      this.http.post<any>('https://seekproduct-api.misavu.net/api/user/productgroup/', pro, {
            headers: new HttpHeaders({
              Authorization: 'JWT ' + localStorage.getItem('TOKEN')
            }),
            observe: 'response'
          }).subscribe((data)=>{
            console.log(data);
            this.productGroup_Full_list.push(data.body);
            this.productGroup_list.push(data.body);
          });
    }
  }
  err : boolean = false;
  checkEdit : boolean = false;
  EditProductGroup(id : any){
    this.checkEdit = true;
    this.productGroup_Full_list.forEach((value,key)=>{
      if(value.id == id){
        const temp = this.my_company.filter(item => item.id == value.company);
        console.log(temp);
        if(temp.length == 0){
            this.err = true;
            this.checkEdit = false;
            Swal.fire({
              position: 'center',
              icon: 'error',
              title: 'You Unauthorized\n',
              showConfirmButton: false,
              timer: 1500
            });
        } else {
          this.err = false;
          this.checkEdit = true;
          this.product_Group_ID = id;
        }
      }
    });
    const productG =  this.productGroup_list.filter(item => item.id == id);
    //console.log(productG[0]);
    this.company_id = productG[0].company;
    this.name = productG[0].name;
    this.info = productG[0].info;
    this.selectCompany = productG[0].company;
  }

}
