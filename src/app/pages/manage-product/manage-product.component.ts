import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { from } from 'rxjs';
import Swal from 'sweetalert2';
import { Product } from './manage-product.model';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { filter } from 'rxjs/operators';
import { async } from '@angular/core/testing';
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
  category: {
    id: number,
    name: string,
    info: string
  };
  productgroup: string = '';
  description: string = '';
  full_description: string = '';
  faq: string = '';
  company = [];
  category_Arr = [];
  Full_category_Arr = [];
  productgroup_Arr = [];
  company_id: string = '';
  company_site: string = '';
  selectCompany: string = '';
  selectProduct: string = '';
  selectCategory: string = '';
  selectColor: string = '';
  productFollowArray = [];
  product: Product = {
    category: '', description: '', name: '', color: '', downloads: '',
    faq: '', full_description: '', image: '', in_stock: 0, model: '', price: 0, productgroup: '',
    tag: '', vat: ''
  };
  page: number = 1;
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
    this.check = !this.check;
  }
  ngOnInit(): void {
    this.selectedValue = this.manage_product[0].value;
    this.selectColor = this.colors[0].name;
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
        for (var i = 0; i < ca.length; i++) {
          console.log(this.Full_category_Arr.filter(item => item.id == ca[i]));
          this.category_Arr.push(this.Full_category_Arr.filter(item => item.id == ca[i])[0]);
        };
      }
      this.category = this.category_Arr[0];
      this.company_site = data.results[0].site;
      console.log(data.results[0].site);
      console.log(this.category_Arr[0]);
      console.log(this.company_site);

    });
    this.followedproducts_list();
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

  onChange(event: any) {
    console.log(event.target.id + " = " + event.target.value);
    this[event.target.id] = event.target.value;
    if (event.target.id == 'company_id') {
      const companySelect = this.company.filter(item => item.id == event.target.value);
      this.productgroup_Arr = companySelect[0].productgroup;
      this.company_site = companySelect[0].site;
      if (companySelect[0].productgroup.length > 0) {
        this.selectProduct = companySelect[0].productgroup[0].id;
      }
      const ca = companySelect[0].category;
      if (ca.length > 0) {
        console.log(ca[0]);
        this.selectCategory = ca[0];
        this.category_Arr = [];
        for (var i = 0; i < ca.length; i++) {
          console.log(this.Full_category_Arr.filter(item => item.id == ca[i]));
          this.category_Arr.push(this.Full_category_Arr.filter(item => item.id == ca[i])[0]);
        };
      }
    }
    // console.log(this.company_site);
  }

  productUpdate: any = {};
  EditProduct(id: any) {
    console.log("Product id : " + id);
    this.http.get<any>('https://seekproduct-api.misavu.net/api/user/product/' + id, {
      headers: new HttpHeaders({
        Authorization: 'JWT ' + localStorage.getItem('TOKEN')
      })
    }).subscribe((data) => {
      console.log(data);
      this.productUpdate = data;
      this.selectCategory = data.category[0].id;
      this.selectCompany = data.company_id;
      this.selectProduct = data.productgroup;
      this.name = data.name;
      this.model = data.model;
      this.price = data.price;
      this.description = data.description;
      this.tag = data.tag;
      this.in_stock = data.in_stock;
      this.vat = data.vat;
      this.selectColor = data.color.charAt(0).toUpperCase() + data.color.slice(1);
      this.full_description = data.full_description;
      this.image = data.image;
      this.downloads = data.downloads;
      this.faq = data.faq;
    },
      error => {
        console.log(error);
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: error.statusText,
          showConfirmButton: false,
          timer: 1500
        });
      }
    );
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

  Submit() {
    // console.log(this.productUpdate);
    // this.productUpdate.color = 'Red';
    // this.productUpdate.category = 4;

    // const test = {
    //   description: "abc",
    //   name: "OOOOO",
    //   color: "abc",
    //   downloads: "abc",
    //   faq: "abc",
    //   full_description: "abc",
    //   image: "abc",
    //   in_stock: 5,
    //   model: "abc",
    //   price: 15,
    //   productgroup: 177,
    //   tag: "abc",
    //   vat: "12", 
    //   category:4,
    // };

    // const formdata = new FormData();
    // formdata.set('name','mkmk');
    // formdata.set('description','cvbcvb');
    // formdata.set('color','Black');
    // formdata.set('downloads','fsdf');
    // formdata.set('faq','sfdsd');
    // formdata.set('full_description','sdfsd');
    // formdata.set('image','http://haianhnguyen.ml/img/logoinvisible.png');
    // formdata.set('in_stock','10');
    // formdata.set('model','cvbcv');
    // formdata.set('price','150');
    // formdata.set('productgroup','177');
    // formdata.set('tag','cvbcv');
    // formdata.set('vat','cvbvc');
    // formdata.set('category','4');
    // this.http.post<any>('https://seekproduct-api.misavu.net/api/user/product/?site=bs',formdata,{
    //     headers: new HttpHeaders({
    //       Authorization: 'JWT ' + localStorage.getItem('TOKEN'),
    //     })
    //   }).subscribe((data)=> {
    //     console.log(data);
    //   });

    //   this.http.put('https://seekproduct-api.misavu.net/api/user/product/' + 243,formdata, {
    //   headers: new HttpHeaders({
    //     Authorization: 'JWT ' + localStorage.getItem('TOKEN'),
    //   }),
    // }).subscribe((data) => { console.log(data) });

    // this.product.category = '4';
    // this.product.description = this.description;
    // this.product.name = this.name;
    // this.product.color = this.color;
    // this.product.downloads = this.downloads;
    // this.product.faq = this.faq;
    // this.product.full_description = this.full_description;
    // this.product.image = this.image;
    // this.product.in_stock = this.in_stock;
    // this.product.model = this.model;
    // this.product.price = this.price;
    // this.product.productgroup = this.productgroup;
    // this.product.tag = this.tag;
    // this.product.vat = this.vat;
    // console.log(test);
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
