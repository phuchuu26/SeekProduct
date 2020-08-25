import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { from } from 'rxjs';
import Swal from 'sweetalert2';
import { Product } from './manage-product.model';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { filter } from 'rxjs/operators';
import { catchError, map, tap } from "rxjs/operators";
import { throwError, Observable } from "rxjs";

interface Manage_Product {
  value: string;
  viewValue: string;
}
interface Color {
  name: string;
}

@Component({
  selector: 'app-manage-product',
  templateUrl: './manage-product.component.html',
  styleUrls: ['./manage-product.component.css']
})
export class ManageProductComponent implements OnInit {
  selectedValue: string;
  productArray = [];
  check = false;
  name: string = '';
  model: string = '';
  price: number = 0;
  in_stock: number = 0;
  vat: string = '';
  color: string = '';
  tag: string = '';
  image: string = '';
  downloads: string = '';
  category: string = '';
  productgroup: string = '';
  description: string = '';
  full_description: string = '';
  faq: string = '';
  company = [];
  category_Arr = [];
  Full_category_Arr = [];
  productgroup_Arr = [];
  company_id: string = '';
  product_id : string = '';
  company_site: string = '';
  selectCompany: string = '';
  selectProduct: string = '';
  selectCategory: string = '';
  productFollowArray = [];
  page: number = 1;
  checkSubmit : boolean = false;
  fileToUpload : File = null;
  checkEdit : boolean = false;
  constructor(private http: HttpClient, public dialog: MatDialog) { }

  manage_product: Manage_Product[] = [
    { value: 'feature_products', viewValue: 'Feature Product' },
    { value: 'my_product', viewValue: 'My Product' },
    { value: 'products', viewValue: 'Products' }
  ];
  colors: Color[] = [
    { name: 'White' }, { name: 'Blue' }, { name: 'Green' }, { name: 'Yellow' },
    { name: 'Orange' }, { name: 'Pink' }, { name: 'Gray' }, { name: 'Red' }, { name: 'Black' },
  ];
  feature_products() {
    this.http.get<any>('https://seekproduct-api.misavu.net/api/user/product/feature_products', {
      headers: new HttpHeaders({
        Authorization: 'JWT ' + localStorage.getItem('TOKEN')
      })
    }).subscribe(data => {
      console.log(data.results);
      this.productArray = data.results;
    });
  }
  my_products() {
    this.http.get<any>('https://seekproduct-api.misavu.net/api/user/product/my-product/?ordering=id&order=DESC', {
      headers: new HttpHeaders({
        Authorization: 'JWT ' + localStorage.getItem('TOKEN')
      })
    }).subscribe(data => {
      console.log(data.results);
      this.productArray = data.results;
    });
  }
  followedproducts_list() {
    this.http.get<any>('https://seekproduct-api.misavu.net/api/user/followedproducts/list/', {
      headers: new HttpHeaders({
        Authorization: 'JWT ' + localStorage.getItem('TOKEN'),
      })
    }).subscribe((data) => {
      this.productFollowArray = data.results;
    });
  }
  async product_list() {
    let count = 0;
    let temp = [];
    this.productArray = [];
    await this.http.get<any>('https://seekproduct-api.misavu.net/api/user/product/?page=' + 1, {
      headers: new HttpHeaders({
        Authorization: 'JWT ' + localStorage.getItem('TOKEN'),
      })
    }).subscribe(async (data) => {
      // console.log(data.results.length);
      // console.log(data.count);
      count = data.count;
      for (var a = 0; a < data.results.length; a++) {
        temp[temp.length] = data.results[a];
      }
      var j = 2;
      for (var i = 10; i < count; i = i + 10) {
        this.http.get<any>('https://seekproduct-api.misavu.net/api/user/product/?page=' + j, {
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
      this.productArray = await temp;
    });
  }

  openCreateProduct() {
    if(this.check === true && this.checkEdit === true){
      this.clearnData();
      this.checkEdit = false;
    } else if(this.check === true && this.checkEdit === false){
      this.check = !this.check;
      this.clearnData();
    } else{
      this.check = !this.check;
    }
  }
  clearnData(){
  this.name = '';
  this.model = '';
  this.price = 0;
  this.in_stock = 0;
  this.vat = '';
  this.tag = '';
  this.image = '';
  this.downloads = '';
  this.category = '';
  this.productgroup = '';
  this.description = '';
  this.full_description = '';
  this.faq = '';
  this.company_id = '';
  this.product_id  = '';
  this.company_site = '';
  this.selectCompany = '';
  this.selectProduct = '';
  this.selectCategory = '';
  this.color = '#ffffff';
  this.company_id = this.company[0].id;
      this.selectCompany = this.company[0].id;
      const companySelect = this.company.filter(item => item.id == this.company[0].id);
      this.productgroup_Arr = companySelect[0].productgroup;
      this.selectProduct = companySelect[0].productgroup[0].id;
      this.company_site = companySelect[0].site;
      this.productgroup = companySelect[0].productgroup[0].id;
      const ca = companySelect[0].category;
      console.log(companySelect[0].category);
      if (ca.length > 0) {
        console.log(ca[0]);
        this.selectCategory = ca[0];
        this.category = ca[0];
        for (var i = 0; i < ca.length; i++) {
          console.log(this.Full_category_Arr.filter(item => item.id == ca[i]));
          this.category_Arr.push(this.Full_category_Arr.filter(item => item.id == ca[i])[0]);
        };
      }
      this.company_site = this.company[0].site;
  }
  ngOnInit(): void {
    this.selectedValue = this.manage_product[0].value;
    this.color = '#ffffff';
    this.http.get<any>('https://seekproduct-api.misavu.net/api/category').subscribe((data) => {
      this.Full_category_Arr = data.results;
    }
    );
    this.feature_products();
    this.http.get<any>('https://seekproduct-api.misavu.net/api/user/company/my-company/', {
      headers: new HttpHeaders({
        Authorization: 'JWT ' + localStorage.getItem('TOKEN'),
      })
    }).subscribe(data => {
      this.company = data.results;
      this.company_id = data.results[0].id;
      this.selectCompany = data.results[0].id;
      const companySelect = this.company.filter(item => item.id == data.results[0].id);
      this.productgroup_Arr = companySelect[0].productgroup;
      this.selectProduct = companySelect[0].productgroup[0].id;
      this.company_site = companySelect[0].site;
      this.productgroup = companySelect[0].productgroup[0].id;
      const ca = companySelect[0].category;
      console.log(companySelect[0].category);
      if (ca.length > 0) {
        console.log(ca[0]);
        this.selectCategory = ca[0];
        this.category = ca[0];
        for (var i = 0; i < ca.length; i++) {
          console.log(this.Full_category_Arr.filter(item => item.id == ca[i]));
          this.category_Arr.push(this.Full_category_Arr.filter(item => item.id == ca[i])[0]);
        };
      }
      //this.category = this.category_Arr[0];
      this.company_site = data.results[0].site;
      console.log(data.results[0].site);
      console.log(this.category_Arr[0]);
      console.log(this.company_site);

    });
    this.followedproducts_list();
    this.package_list();
  }
  pageChanged(event: any) {
    console.log(event);
    this.page = event;
  }

  changeData(event: any) {
    console.log("Select : " + event.value);
    this.page = 1;
    if (event.value == 'my_product') {
      this.my_products();
    } else if (event.value == 'feature_products') {
      this.feature_products();
    } else if (event.value == 'products') {
      this.product_list();
    }
  }
  changeAvatar(files : FileList){
    this.fileToUpload = files.item(0);
    console.log(files);
    console.log(this.fileToUpload);
  }

  onChange(event: any) {
    console.log(event.target.id + " = " + event.target.value);
    this[event.target.id] = event.target.value;
    if (event.target.id == 'company_id') {
      const companySelect = this.company.filter(item => item.id == event.target.value);
      this.productgroup_Arr = companySelect[0].productgroup;
      this.company_site = companySelect[0].site;
      if (companySelect[0].productgroup.length > 0) {
        this.selectProduct = companySelect[0].productgroup[0].id;
        this.productgroup = companySelect[0].productgroup[0].id;
      } else {
        this.selectProduct = '';
        this.productgroup = '';
      }
      const ca = companySelect[0].category;
      if (ca.length > 0) {
        console.log(ca[0]);
        this.selectCategory = ca[0];
        this.category = ca[0];
        this.category_Arr = [];
        for (var i = 0; i < ca.length; i++) {
          console.log(this.Full_category_Arr.filter(item => item.id == ca[i]));
          this.category_Arr.push(this.Full_category_Arr.filter(item => item.id == ca[i])[0]);
        };
      } else {
        this.selectCategory = '';
        this.category = '';
      }
    }
     console.log(this.company_site);
  }
  changeColor(event : any){
    console.log(event);
  }


   EditProduct(id: any) {
    console.log("Product id : " + id);
     this.http.get<any>('https://seekproduct-api.misavu.net/api/user/product/' + id, {
      headers: new HttpHeaders({
        Authorization: 'JWT ' + localStorage.getItem('TOKEN')
      })
    }).subscribe((data) => {
      console.log(data);
      this.product_id = data.id;
      this.selectCategory = data.category[0].id;
      this.selectCompany = data.company_id;
     // this.selectProduct = data.productgroup;
      this.name = data.name;
      this.model = data.model;
      this.price = data.price;
      this.description = data.description;
      this.tag = data.tag;
      this.in_stock = data.in_stock;
      this.vat = data.vat;
      this.full_description = data.full_description;
      this.downloads = data.downloads;
      this.faq = data.faq;
      this.color = data.color;
      //this.productgroup = data.productgroup;
     // this.category = data.category[0].id;
      const companySelect = this.company.filter(item => item.id == data.company_id);
        this.productgroup_Arr = companySelect[0].productgroup;
        this.company_site = companySelect[0].site;
        if (companySelect[0].productgroup.length > 0) {
          this.selectProduct = companySelect[0].productgroup[0].id;
          this.productgroup = companySelect[0].productgroup[0].id;
        }
        const ca = companySelect[0].category;
        if (ca.length > 0) {
          console.log(ca[0]);
          this.selectCategory = ca[0];
          this.category = ca[0];
          this.category_Arr = [];
          for (var i = 0; i < ca.length; i++) {
            console.log(this.Full_category_Arr.filter(item => item.id == ca[i]));
            this.category_Arr.push(this.Full_category_Arr.filter(item => item.id == ca[i])[0]);
          };
        }
    }
    );
    if(this.check === false){
      this.check = true;
    }
    this.checkEdit = true;

  }
  deleteProduct(id: any) {
    console.log("Product id : " + id);
    Swal.fire({
      title: 'Are you sure?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        this.http.delete<any>('https://seekproduct-api.misavu.net/api/user/product/' + id, {
          headers: new HttpHeaders({
            Authorization: 'JWT ' + localStorage.getItem('TOKEN')
          }),
          observe: 'response'
        }).subscribe((event) => {
          console.log(event.status);
          if (event.status == 204) {
            console.log(this.productArray.filter(item => item.id !== id));
            this.productArray = this.productArray.filter(item => item.id !== id);
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'You delete Success',
              showConfirmButton: false,
              timer: 1500
            });
          } else {
            Swal.fire({
              position: 'center',
              icon: 'error',
              title: 'You delete FAIL\n' + event.body.message,
              showConfirmButton: false,
              timer: 1500
            });
          }
        });
      }
    });

  }

  addProduct(){
    const formdata = new FormData();
    formdata.set('name',this.name);
    formdata.set('description',this.description);
    formdata.set('color',this.color);
    formdata.set('downloads',this.downloads);
    formdata.set('faq',this.faq);
    formdata.set('full_description',this.full_description);
    if(this.fileToUpload != null){
      formdata.append('image',this.fileToUpload, this.fileToUpload.name);
    } else formdata.append('image','');
    formdata.set('in_stock',this.in_stock+'');
    formdata.set('model',this.model);
    formdata.set('price',this.price+'');
    formdata.set('productgroup',this.productgroup);
    formdata.set('tag',this.tag);
    formdata.set('vat',this.vat);
    formdata.set('category',this.category);
    this.http.post<any>('https://seekproduct-api.misavu.net/api/user/product/?site='+ this.company_site,formdata,{
        headers: new HttpHeaders({
          Authorization: 'JWT ' + localStorage.getItem('TOKEN'),
        })
      }).subscribe((data)=> {
        console.log(data);
        this.http.get<any>('https://seekproduct-api.misavu.net/api/user/product/' + data.id, {
      headers: new HttpHeaders({
        Authorization: 'JWT ' + localStorage.getItem('TOKEN')
      }), observe: 'response'
    }).subscribe((res)=>{
      this.productArray.push(res);
    });
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'You Add Product Success',
          showConfirmButton: false,
          timer: 1500
        });
        this.clearnData();
        this.check = false;
      }, (err : any) =>{
        console.log("Lỗi "+err.status);
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'You Add Product Fail\n Error ' + err.status +" "+ err.statusText,
          showConfirmButton: false,
          timer: 1500
        })
      });
  }
  UpdateProduct(){
    const formdata = new FormData();
    formdata.set('name',this.name);
    formdata.set('description',this.description);
    formdata.set('color',this.color);
    formdata.set('downloads',this.downloads);
    formdata.set('faq',this.faq);
    formdata.set('full_description',this.full_description);
    if(this.fileToUpload != null){
      formdata.append('image',this.fileToUpload, this.fileToUpload.name);
    }
    formdata.set('in_stock',this.in_stock+'');
    formdata.set('model',this.model);
    formdata.set('price',this.price+'');
    formdata.set('productgroup',this.productgroup);
    formdata.set('tag',this.tag);
    formdata.set('vat',this.vat);
    formdata.set('category',this.category);
    this.http.put<any>('https://seekproduct-api.misavu.net/api/user/product/'+this.product_id,formdata,{
        headers: new HttpHeaders({
          Authorization: 'JWT ' + localStorage.getItem('TOKEN'),
        })
      }).subscribe( async (data)=> {
        console.log(data);
        this.my_products();
        // await this.productArray.forEach((value)=>{
        //   if(value.id == this.product_id){
        //     value.name = formdata.get('name');
        //     value.description = formdata.get('description');
        //     value.color = formdata.get('color');
        //     value.downloads = formdata.get('downloads');
        //     value.faq = formdata.get('faq');
        //     value.full_description = formdata.get('full_description');
        //     value.in_stock = formdata.get('in_stock');
        //     value.model = formdata.get('model');
        //     value.price = formdata.get('price');
        //     value.tag = formdata.get('tag');
        //     value.vat = formdata.get('vat');
        //     value.category = this.category_Arr.filter(item => item.id == formdata.get('category'))[0];
        //     value.productgroup = this.productgroup_Arr.filter(item => item.id == formdata.get('productgroup'))[0];
        //     console.log(value.category);
        //     console.log(this.category_Arr.filter(item => item.id == formdata.get('category'))[0]);
        //   }
        // });
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'You Update Product Success',
          showConfirmButton: false,
          timer: 1500
        });
        this.checkEdit = false;
        this.check = false;
      }, err =>{
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'You Update Product Fail',
          showConfirmButton: false,
          timer: 1500
        })
      });
  }

  Submit() {
    this.checkSubmit = true;
    console.log(this.productgroup);
    console.log(this.category);
    if(this.name.length > 0 && this.description.length > 0 && this.downloads.length > 0 && this.faq.length > 0 


      && this.full_description.length > 0 && this.in_stock > 0 && this.model.length > 0 && this.price > 0 &&
      this.tag.length > 0 && this.vat.length > 0 && this.productgroup != '' && this.category != ''){
        if(this.checkEdit === false){
          this.addProduct();
        }
        else if(this.checkEdit === true) this.UpdateProduct();
        this.checkSubmit = false;
    }
  }

  followProduct(id: any) {
    console.log("Follow : " + id);
    this.http.post<any>('https://seekproduct-api.misavu.net/api/user/followedproducts/follow/' + id + '/', id, {
      headers: new HttpHeaders({
        Authorization: 'JWT ' + localStorage.getItem('TOKEN'),
        'Content-Type': 'application/json'
      })
    }).subscribe((event) => {
      console.log(event.status);
      if (event.status === 'ok') {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: event.message,
          showConfirmButton: false,
          timer: 1500
        });
        this.followedproducts_list();
      } else if (event.status === 'error') {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: event.message,
          showConfirmButton: false,
          timer: 1500
        })
      }
    });
  }
  unFollowProduct(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, UnFollow it!'
    }).then((result) => {
      if (result.value) {
        this.http.delete<any>('https://seekproduct-api.misavu.net/api/user/followedproducts/unfollow/' + id + '/', {
          headers: new HttpHeaders({
            Authorization: 'JWT ' + localStorage.getItem('TOKEN')
          })
        }).subscribe((data) => {
          console.log(data.status);
          if (data.status == 200) {
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: data.message,
              showConfirmButton: false,
              timer: 1500
            });
            this.productFollowArray = this.productFollowArray.filter(item => item.id != id);
          }
          else if (data.status == 404) {
            Swal.fire({
              position: 'center',
              icon: 'error',
              title: data.message,
              showConfirmButton: false,
              timer: 1500
            })
          }
        });
      }
    });
  }

  //gallery
  gallery_Product: any;
  gallery_Aray = [];
  changeProductGallery(event: any) {
    console.log(event.value);
    this.http.get<any>('https://seekproduct-api.misavu.net/api/user/product/' + event.value, {
      headers: new HttpHeaders({
        Authorization: 'JWT ' + localStorage.getItem('TOKEN')
      })
    }).subscribe((data) => {
      console.log(data.product_gallery);
      this.gallery_Aray = data.product_gallery;
    });
  }

  yourFn(event: any) {
    console.log(event.index);
    this.page = 1;
    if (event.index == 0) {
      this.feature_products();
      this.selectedValue = this.manage_product[0].value;
    } else if (event.index == 1) {

    } else if (event.index == 2) {
      this.http.get<any>('https://seekproduct-api.misavu.net/api/user/product/my-product/?ordering=id&order=DESC', {
        headers: new HttpHeaders({
          Authorization: 'JWT ' + localStorage.getItem('TOKEN')
        })
      }).subscribe(data => {
        //console.log(data.results);
        this.productArray = data.results;
        this.gallery_Product = data.results[0].id;
        this.http.get<any>('https://seekproduct-api.misavu.net/api/user/product/' + data.results[0].id, {
          headers: new HttpHeaders({
            Authorization: 'JWT ' + localStorage.getItem('TOKEN')
          })
        }).subscribe((data) => {
          //console.log(data.product_gallery);
          this.gallery_Aray = data.product_gallery;
        });
      });
    } else if(event.index == 3){
      this.http.get<any>('https://seekproduct-api.misavu.net/api/user/product/my-product/?ordering=id&order=DESC', {
      headers: new HttpHeaders({
        Authorization: 'JWT ' + localStorage.getItem('TOKEN')
      })
    }).subscribe(data => {
      console.log(data.results);
      this.productOptions = data.results;
    });
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '350px',
      data: null
    });
    dialogRef.afterClosed().pipe(
      filter(result => result)
    ).subscribe(result => {
      console.log(result);
      this.gallery_Aray.push(result);
    });
  }
  openDialogEdit(id: any): void {
    const galleryDel: any = this.gallery_Aray.filter(item => item.id == id);
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '350px',
      data: { id: id, product_id: galleryDel[0].product, source: galleryDel[0].source, site: '' }
    });

    dialogRef.afterClosed().pipe(
      filter(result => result)
    ).subscribe(result => {
      console.log('The dialog was closed Edit');
      console.log(result);
      if (this.gallery_Product == result.product) {
        console.log("chung product");
        this.gallery_Aray.forEach((value, key) => {
          if (value.id == result.id) {
            value.source = result.source;
            return;
          }
        });
      }
      else {
        console.log("khác product" + result.id);
        this.gallery_Aray = this.gallery_Aray.filter(item => item.id != result.id);
      }
    });
  }
  editGallery(id: any) {
    console.log(id);
    const gallery = { 'product_id': '240', 'source': '', 'site': 'bs' };
    this.http.put('https://seekproduct-api.misavu.net/api/user/product/gallery/' + id + '/update', gallery, {
      headers: new HttpHeaders({
        Authorization: 'JWT ' + localStorage.getItem('TOKEN')
      })
    }).subscribe((data) => { console.log(data) });
  }

  deleteGallery(id: any) {
    console.log(id);
    console.log(this.gallery_Aray.filter(item => item.id == id));
    const galleryDel: any = this.gallery_Aray.filter(item => item.id == id);
    const formData = new FormData();
    this.http.get<any>('https://seekproduct-api.misavu.net/api/user/product/' + galleryDel[0].product, {
      headers: new HttpHeaders({
        Authorization: 'JWT ' + localStorage.getItem('TOKEN')
      })
    }).subscribe((data) => {
      console.log(data.id);
      formData.set('product_id', data.id);
      formData.set('site', data.site);
      Swal.fire({
        title: 'Are you sure?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.value) {
          const options = {
            body: formData,
            headers: new HttpHeaders({
              Authorization: 'JWT ' + localStorage.getItem('TOKEN')
            })
          };
          this.http.delete<any>('https://seekproduct-api.misavu.net/api/user/product/gallery/' + id + '/delete', options)
            .subscribe((event) => {
              this.gallery_Aray = this.gallery_Aray.filter(item => item.id !== id);
              Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'You delete Success',
                showConfirmButton: false,
                timer: 1500
              });
            }, error => {
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
    });
  }

  async package_list() {
    let count = 0;
    let temp = [];
    await this.http.get<any>('https://seekproduct-api.misavu.net/api/user/product/options/list?page=' + 1, {
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
        this.http.get<any>('https://seekproduct-api.misavu.net/api/user/product/options/list?page=' + j, {
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
      this.package = await temp;
    });
  }
productOptions = [];
productOpp = {product_id: '', site:'', package_id:''};
package = [];
productOptions_id: string = '';
checkOption : boolean = false;
checkEditOption: boolean = false;
  addProductOption(id : any){
    this.checkEditOption = false;
    let temp : any = this.productOptions.filter(item => item.id == id)[0];
    console.log(temp.options);
      if(temp.options != null){
        this.checkOption = true;
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Option already exists \n',
          showConfirmButton: false,
          timer: 1500
        });
    } else if(temp.options == null) {
      this.checkOption = false;
      this.productOpp.product_id = temp.id;
      this.productOpp.site = temp.site;
      this.productOpp.package_id = this.package[0].id;
    }
  }
  UpdateProductOption(id: any){
    this.checkEditOption = true;
    let temp : any = this.productOptions.filter(item => item.id == id)[0];
    console.log(temp.options);
    console.log(this.productOptions_id);
      if(temp.options == null){
        this.checkOption = true;
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Option does not exist\n You must Add Option',
          showConfirmButton: false,
          timer: 1500
        });
    } else if(temp.options != null) {
      this.checkOption = false;
      this.productOpp.product_id = temp.id;
      this.productOpp.site = temp.site;
      this.productOpp.package_id = temp.options.package.id;
      this.productOptions_id = temp.options.id;

    }
  }

  DeleteProductOption(id : any){
    let temp : any = this.productOptions.filter(item => item.id == id)[0];
    console.log(temp.options);
    console.log(this.productOptions_id);
    let formdata = new FormData();
      if(temp.options == null){
        this.checkOption = true;
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Option does not exist\n You must Add Option',
          showConfirmButton: false,
          timer: 1500
        });
    } else if(temp.options != null) {

      formdata.set('product_id',temp.id);
      formdata.set('site',temp.site);
      Swal.fire({
        title: 'Are you sure?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.value) {
          const options = {
            body: formdata,
            headers: new HttpHeaders({
              Authorization: 'JWT ' + localStorage.getItem('TOKEN')
            })
          };
          this.http.delete<any>('https://seekproduct-api.misavu.net/api/user/product/options/destroy/'+temp.options.id, options)
          .subscribe((event) => {
            this.productOptions.forEach((value)=>{
              if(value.id == formdata.get('product_id')){
                value.options = null;
              }
            });
              Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'You delete Success',
                showConfirmButton: false,
                timer: 1500
              });
            }
          , err =>{
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
  }
  changeProductOption(event : any){
    this.productOpp[event.target.id] = event.target.value;
    console.log(event.target.id + " = " + event.target.value);
    if(event.target.id == 'product_id'){
      let temp : any = this.productOptions.filter(item => item.id == event.target.value)[0];
      this.productOpp.site = temp.site;
    }
  }


  submit(){
    console.log(this.productOpp);
    const formdata = new FormData();
    formdata.set('product_id',this.productOpp.product_id);
    formdata.set('package_id',this.productOpp.package_id);
    formdata.set('site',this.productOpp.site);
    if(this.checkEditOption === false){
    this.http.post<any>('https://seekproduct-api.misavu.net/api/user/product/options/create', formdata, {
      headers: new HttpHeaders({
        Authorization: 'JWT ' + localStorage.getItem('TOKEN')
      })
    }).subscribe((event) => {
      this.productOptions.forEach((value)=>{
        if(value.id == this.productOpp.product_id){
          value.options = event;
        }
      });
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'You Add Success',
          showConfirmButton: false,
          timer: 1500
        });
      }, err =>  {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'You add Product Option Fail\n',
          showConfirmButton: false,
          timer: 1500
        })
      });
    } else
      if(this.checkEditOption === true){
        this.http.put<any>('https://seekproduct-api.misavu.net/api/user/product/options/update/'+this.productOptions_id, formdata, {
      headers: new HttpHeaders({
        Authorization: 'JWT ' + localStorage.getItem('TOKEN')
      })
    }).subscribe((event) => {
      this.productOptions.forEach((value)=>{
        if(value.id == this.productOpp.product_id){
          value.options.package = this.package.filter(item => item.id == event.package_id)[0];
        }
      });
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'You Add Success',
          showConfirmButton: false,
          timer: 1500
        });
      }, err =>  {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'You add Product Option Fail\n',
          showConfirmButton: false,
          timer: 1500
        })
      });

      }
  }
}

export interface DialogData {
  id: string;
  product_id: string;
  source: string;
  site: string;
}
@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'dialog-overview-example-dialog.html',
  styleUrls: ['./manage-product.component.css']

})
export class DialogOverviewExampleDialog implements OnInit {
  productArray = [];
  selectProduct: string;
  site: string = '';
  product_ID: string = '';
  @ViewChild('labelImport')
  labelImport: ElementRef;
  constructor(
    private http: HttpClient,
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnInit(): void {
    this.http.get<any>('https://seekproduct-api.misavu.net/api/user/product/my-product/?ordering=id&order=DESC', {
      headers: new HttpHeaders({
        Authorization: 'JWT ' + localStorage.getItem('TOKEN')
      })
    }).subscribe(res => {
      console.log(res.results);
      let id = res.results[0].id;
      this.productArray = res.results;
      this.selectProduct = res.results[0].id;
      this.product_ID = res.results[0].id;
      if (this.data != null) {
        this.selectProduct = this.data.product_id;
        this.product_ID = this.data.product_id;
        id = this.data.product_id;
      }
      console.log(id);
      this.http.get<any>('https://seekproduct-api.misavu.net/api/user/product/' + id, {
        headers: new HttpHeaders({
          Authorization: 'JWT ' + localStorage.getItem('TOKEN')
        })
      }).subscribe((data) => {
        this.site = data.site;
      });

    });
  }

  onChange(event: any) {
    console.log(event.target.value);
    this.product_ID = event.target.value;
    this.http.get<any>('https://seekproduct-api.misavu.net/api/user/product/' + event.target.value, {
      headers: new HttpHeaders({
        Authorization: 'JWT ' + localStorage.getItem('TOKEN')
      })
    }).subscribe((data) => {
      this.site = data.site;
    });
  }
  fileToUpload: File = null;

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
    // this.labelImport.nativeElement.innerText = Array.from(files)
    //   .map(f => f.name)
    //   .join(', ');
  }
  submit() {
    const formData = new FormData();
    if (this.data != null) {
      formData.set('product_id', this.product_ID);
      formData.set('site', this.site);
      if (this.fileToUpload != null) {
        formData.append('source', this.fileToUpload, this.fileToUpload.name);
      } else {
        formData.append('source', "");
      }
      this.http.put('https://seekproduct-api.misavu.net/api/user/product/gallery/' + this.data.id + '/update',
        formData, {
        headers: new HttpHeaders({
          Authorization: 'JWT ' + localStorage.getItem('TOKEN')
        })
      }).subscribe(data => {
        console.log(data);
        this.dialogRef.close(data);
        this.fileToUpload = null;
      });
      this.data = null;
    }
    else {
      formData.set('product_id', this.product_ID);
      formData.set('site', this.site);
      if (this.fileToUpload != null) {
        formData.append('source', this.fileToUpload, this.fileToUpload.name);
      } else {
        formData.append('source', '');
      }
      this.http.post('https://seekproduct-api.misavu.net/api/user/product/gallery/create',
        formData, {
        headers: new HttpHeaders({
          Authorization: 'JWT ' + localStorage.getItem('TOKEN')
        })
      }).subscribe((data: any) => {
        this.dialogRef.close(data);
        this.fileToUpload = null;
      });
    }



  }
}
