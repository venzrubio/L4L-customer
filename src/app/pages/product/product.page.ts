/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : ionic 5 groceryee app
  Created : 10-Sep-2020
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2020-present initappz.
*/
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { NavController, ModalController, AlertController } from '@ionic/angular';
import { ViewerModalComponent } from 'ngx-ionic-image-viewer';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.page.html',
  styleUrls: ['./product.page.scss'],
})
export class ProductPage implements OnInit {
 
  qty = 0;

  loaded: boolean;

  name: any = '';
  realPrice: any;
  sellPrice: any;
  discount: any;
  description: any;
  is_single: any;
  subId: any;
  status: any;
  coverImage: any = '';
  veg: any;

  have_gram: any;
  gram: any;
  have_kg: any;
  kg: any;
  have_pcs: any;
  pcs: any;
  have_liter: any;
  liter: any;
  have_ml: any;
  ml: any;
  exp_date: any;

  in_stoke: any;
  in_offer: any;
  key_features: any = '';
  disclaimer: any = '';

  id: any;
  rate: any;
  gallery: any[] = [];
  slideOpts = {
    slidesPerView: 1,
  };

  slideOpts1 = {
    slidesPerView: 2.5,
  };
  related: any[] = [];
  quantiy: any = 0;
  productt: any;
  totalRating: any;
  storeId: any;
  storeName: any;
  size: any;
  variations: any;
  variant: any;
  storeIsActive: boolean = false;
  km:any;

  topProducts: any[] = [];

  stores: any[] = [];
  constructor(
    public api: ApiService,
    public util: UtilService,
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private router: Router,
    public cart: CartService,
    private modalController: ModalController,
    private alertCtrl: AlertController,
    private chMod: ChangeDetectorRef,
  ) {

    this.route.queryParams.subscribe((data: any) => {
      console.log(data);
      if (data && data.id) {
        this.loaded = false;
        this.id = data.id;
        this.getProduct();
      }
    })
  }

  ionViewWillEnter(){

    this.getInit();

  }

  getInit() {


    this.topProducts = [];

    const param = {
      id: localStorage.getItem('city'),
      uid: localStorage.getItem('uid'),
      clat: localStorage.getItem('current_lat'),
      clng: localStorage.getItem('current_lng')
    }

    const param1 = {
      id: localStorage.getItem('city'),
      uid: localStorage.getItem('uid'),
      clat: localStorage.getItem('current_lat'),
      clng: localStorage.getItem('current_lng')

    }

    this.api.post('stores/getTopNearestStore', param).subscribe((stores: any) => {

      this.stores = [];
      if (stores && stores.status === 200 && stores.data && stores.data.length) {
        console.log('city found');
        this.stores = stores.data;
        this.stores.sort((a, b) => parseFloat(a.km) - parseFloat(b.km));
        this.stores.forEach(async (element) => {
          // element['isOpen'] = await this.isOpen(element.open_time, element.close_time);
        });

        this.util.active_store = [...new Set(this.stores.map(item => item.uid))];
        console.log('store====>>>', this.stores);

        this.topProducts = [];
        // this.dummyTopProducts = Array(5);



        this.api.post('products/getTopRated', param).subscribe((data: any) => {
          console.log('top products', data);

          var uniqueNames = [];
          var uniqueObj = [];
          for (var i = 0; i < data.data.length; i++) {
            if (uniqueNames.indexOf(data.data[i].name) === -1) {
              uniqueObj.push(data.data[i])
              uniqueNames.push(data.data[i].name);
            }
          }
          console.log(uniqueObj)
          data.data = uniqueObj;

          data.data.sort((a, b) => parseFloat(a.km) - parseFloat(b.km));


          // this.dummyTopProducts = [];
          if (data && data.status === 200 && data.data && data.data.length) {
            data.data.forEach(element => {
              if (element.variations && element.size === '1' && element.variations !== '') {
                if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false } })(element.variations)) {
                  element.variations = JSON.parse(element.variations);
                  element['variant'] = 0;
                } else {
                  element.variations = [];
                  element['variant'] = 1;
                }
              } else {
                element.variations = [];
                element['variant'] = 1;
              }
              if (this.cart.itemId.includes(element.id)) {
                const index = this.cart.cart.filter(x => x.id === element.id);
                element['quantiy'] = index[0].quantiy;
              } else {
                element['quantiy'] = 0;
              }
              if (this.util.active_store.includes(element.store_id)) {
                this.topProducts.push(element);
              }

            });
          }
        }, error => {
          console.log(error);
          // this.dummyTopProducts = [];
        });


        console.log(param);

      } else {
 
        console.log('no city found');
     
        this.topProducts = [];
  
        this.chMod.detectChanges();
      }
    }, error => {
      console.log('error in get store by city', error);
     
      this.topProducts = [];
     
      this.util.errorToast(this.util.getString('Something went wrong'));
      this.chMod.detectChanges();
    });
  }

  async openViewer(url) {
    const modal = await this.modalController.create({
      component: ViewerModalComponent,
      componentProps: {
        src: url
      },
      cssClass: 'ion-img-viewer',
      keyboardClose: true,
      showBackdrop: true
    });

    return await modal.present();
  }

  getRelated() {
    const param = {
      id: this.subId,
      name: this.name,
      limit: 5,
      cid: localStorage.getItem('city'),
      uid: localStorage.getItem('uid'),
      clat: localStorage.getItem('current_lat'),
      clng: localStorage.getItem('current_lng')
    };
    this.related = [];
    this.api.post('products/getRelated', param).subscribe((data: any) => {
      console.log('=>related=>', data);
      if (data && data.status === 200 && data.data && data.data.length) {
        const products = data.data;
        this.related = products.filter(x => x.id !== this.id);
      }
    }, error => {
      console.log(error);
    });
  }

  checkCartItems() {
    const item = this.cart.cart.filter(x => x.id === this.id);
    console.log('cart=====>>>>>>', item);
    if (item && item.length) {
      this.quantiy = item[0].quantiy;
    }
  }

  getProduct() {
    const param = {
      id: this.id,
      uid: localStorage.getItem('uid'),
      clat: localStorage.getItem('current_lat'),
      clng: localStorage.getItem('current_lng')
    }
    this.api.post('products/getById', param).subscribe((data: any) => {
      this.loaded = true;
      console.log(data);
      this.gallery = [];
      if (data && data.status === 200 && data.data && data.data.length) {
        const info = data.data[0];
        this.productt = info;
        this.productt['quantiy'] = 0;
        this.name = info.name;
        this.description = info.descriptions;
        this.subId = info.sub_cate_id;
        this.coverImage = info.cover;
        this.key_features = info.key_features;
        this.disclaimer = info.disclaimer;
        this.discount = info.discount;
        this.exp_date = info.exp_date;
        this.gram = info.gram;
        this.have_gram = info.have_gram;
        this.kg = info.kg;
        this.have_kg = info.have_kg;
        this.liter = info.liter;
        this.have_liter = info.have_liter;
        this.ml = info.ml;
        this.have_ml = info.have_ml;
        this.pcs = info.pcs;
        this.have_pcs = info.have_pcs;
        this.in_offer = info.in_offer;
        this.in_stoke = info.in_stoke;
        this.is_single = info.is_single;
        this.veg = info.kind;
        this.realPrice = info.original_price;
        this.sellPrice = info.sell_price;
        this.status = info.status;
        this.rate = info.rating;
        this.totalRating = info.total_rating;
        this.storeId = info.store_id;
        this.getStoreStatus();
        this.storeName = info.store_name;
        this.gallery.push(this.coverImage);
        this.size = info.size;
        this.km = info.km;
        if (info.variations && info.size === '1' && info.variations !== '') {
          if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false } })(info.variations)) {
            this.variations = JSON.parse(info.variations);
            this.variant = 0;
            this.productt['variations'] = JSON.parse(info.variations);
            this.productt['variant'] = 0;
          } else {
            info.variations = [];
            this.productt['variations'] = [];
            this.variant = 1;
            this.productt['variant'] = 1;
          }
        } else {
          this.variations = [];
          this.variant = 1;
          this.productt['variations'] = [];
          this.productt['variant'] = 1;
        }
        this.checkCartItems();
        if (info.images) {
          const images = JSON.parse(info.images);
          console.log('images======>>>', images);
          if (images[0]) {
            this.gallery.push(images[0]);
          }
          if (images[1]) {
            this.gallery.push(images[1]);
          }
          if (images[2]) {
            this.gallery.push(images[2]);
          }
          if (images[3]) {
            this.gallery.push(images[3]);
          }
          if (images[4]) {
            this.gallery.push(images[4]);
          }
          if (images[5]) {
            this.gallery.push(images[5]);
          }
        }
        this.getRelated();
      }

    }, error => {
      console.log(error);
      this.loaded = true;
      this.util.errorToast(this.util.getString('Something went wrong'));
    });
  }

  getStoreStatus() {
    const param = {
      id: this.storeId,

      uid: localStorage.getItem('uid'),
      clat: localStorage.getItem('current_lat'),
      clng: localStorage.getItem('current_lng')

    };

    this.api.post('stores/getByUid', param).subscribe((datas: any) => {
      console.log('store info...', datas);
      if (datas && datas.status === 200 && datas.data.length) {
        if (datas.data[0] && datas.data[0].status === '1') {
          this.storeIsActive = true;
        }
      }
    }, error => {
      console.log(error);
    });
  }

  back() {
    this.navCtrl.back();
  }

  ngOnInit() {
  }

  addToCart() {
    this.quantiy = 1;
    this.productt.quantiy = 1;
    this.cart.addItem(this.productt);
  }

  book(item){

    // console.log(item)

    this.cart.cart = [];
    this.cart.itemId = [];

    var i = this.cart.itemId.indexOf(item.id)
  
    if(i == -1){
  
      item.quantiy = 1

      localStorage.setItem('sid', item.store_id)
     
      // this.topProducts[i].quantiy = 1;
      this.cart.addItem(item); 
      this.cart.deliveryAt = "home";
  
      console.log(this.cart)
  
       this.router.navigate(['tabs/home/address'])
  
    }else{
  
      this.remove(item, i);

      item.quantiy = 1
  
      localStorage.setItem('sid', item.store_id)
     
      // this.topProducts[i].quantiy = 1;
      this.cart.addItem(item); 
      this.cart.deliveryAt = "home";
  
      console.log(this.cart)
  
       this.router.navigate(['tabs/home/address'])
      
    }  
  }


  gotoStore() {
    const param: NavigationExtras = {
      queryParams: {
        id: this.storeId,
        name: this.storeName
      }
    };
    this.router.navigate(['tabs/home/store'], param);
  }

  add() {
    this.quantiy = this.quantiy + 1;
    this.cart.addQuantity(this.quantiy, this.id ,this.storeId);
  }

  removeold() {
    if (this.quantiy === 1) {
      this.quantiy = 0;
      this.cart.removeItem(this.id ,this.storeId)
    } else {
      this.quantiy = this.quantiy - 1;
      this.cart.addQuantity(this.quantiy, this.id , this.storeId);
    }
  }

  remove(product, index) {
    console.log(product, index);
    this.topProducts[index].quantiy = this.getQuanity(product.id);
    if (this.topProducts[index].quantiy === 1) {
      this.topProducts[index].quantiy = 0;
      this.cart.removeItem(product.id, product.store_id)
    } else {
      this.topProducts[index].quantiy = this.topProducts[index].quantiy - 1;
      this.cart.addQuantity(this.topProducts[index].quantiy, product.id, product.store_id);
    }
  }

  getQuanity(id) {
    const data = this.cart.cart.filter(x => x.id === id);
    return data[0].quantiy;
  }

  onShare() {

  }

  onFav() {
    if (this.util.favIds.includes(this.id)) {
      console.log('remove this')
      this.util.removeFav(this.id);
      console.log('after removed', this.util.favIds);
      console.log('edit');
      const param = {
        id: localStorage.getItem('uid'),
        ids: this.util.favIds.join()
      };
      this.util.haveFav = true;
      console.log('parama', param)
      this.api.post('favourite/editList', param).subscribe((data: any) => {
        console.log('save response', data);
        if (data && data.status !== 200) {
          this.util.errorToast(this.util.getString('Something went wrong'));
        }
      }, error => {
        console.log('error on save', error);
        this.util.errorToast(this.util.getString('Something went wrong'));
      });
    } else {
      console.log('add new');
      this.util.setFav(this.id);
      console.log('after added', this.util.favIds);
      if (this.util.haveFav) {
        console.log('edit');
        const param = {
          id: localStorage.getItem('uid'),
          ids: this.util.favIds.join()
        };
        this.util.haveFav = true;
        console.log('parama', param)
        this.api.post('favourite/editList', param).subscribe((data: any) => {
          console.log('save response', data);
          if (data && data.status !== 200) {
            this.util.errorToast(this.util.getString('Something went wrong'));
          }
        }, error => {
          console.log('error on save', error);
          this.util.errorToast(this.util.getString('Something went wrong'));
        });
      } else {
        console.log('save');
        const param = {
          uid: localStorage.getItem('uid'),
          ids: this.util.favIds.join()
        };
        this.util.haveFav = true;
        console.log('parama', param)
        this.api.post('favourite/save', param).subscribe((data: any) => {
          console.log('save response', data);
          if (data && data.status !== 200) {
            this.util.errorToast(this.util.getString('Something went wrong'));
          }
        }, error => {
          console.log('error on save', error);
          this.util.errorToast(this.util.getString('Something went wrong'));
        });
      }
    }
  }

  singleProduct(item) {
    const param: NavigationExtras = {
      queryParams: {
        id: item.id
      }
    };

    this.router.navigate(['/tabs/categories/product'], param);
  }

  productRating() {
    const param: NavigationExtras = {
      queryParams: {
        id: this.id,
        name: this.name,
        type: 'product'
      }
    }

    this.router.navigate(['/tabs/home/ratings'], param);
  }

  async variants() {

    const allData = [];

    if (this.variations !== '' && this.variations.length > 0 && this.variations[0].items.length > 0) {
      console.log('->', this.variations[0].items);
      this.variations[0].items.forEach((element, index) => {
        console.log('OK');
        let title = '';
        if (this.util.cside === 'left') {
          const price = this.variations && this.variations[0] &&
            this.variations[0].items[index] &&
            this.variations[0].items[index].discount ? this.variations[0].items[index].discount :
            this.variations[0].items[index].price;
          title = element.title + ' - ' + this.util.currecny + ' ' + price;
        } else {
          const price = this.variations && this.variations[0] && this.variations[0].items[index] &&
            this.variations[0].items[index].discount ? this.variations[0].items[index].discount :
            this.variations[0].items[index].price;
          title = element.title + ' - ' + price + ' ' + this.util.currecny;
        }
        const data = {
          name: element.title,
          type: 'radio',
          label: title,
          value: index,
          checked: this.variant === index
        };
        allData.push(data);
      });

      console.log('All Data', allData);
      const alert = await this.alertCtrl.create({
        header: this.name,
        inputs: allData,
        buttons: [
          {
            text: this.util.getString('Cancel'),
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
              console.log('Confirm Cancel');
            }
          }, {
            text: this.util.getString('Ok'),
            handler: (data) => {
              console.log('Confirm Ok', data);
              console.log('before', this.variant);
              this.variant = data;
              console.log('after', this.variant);
              this.productt['variant'] = data;
            }
          }
        ]
      });

      await alert.present();
    } else {
      console.log('none');
    }

  }
}
