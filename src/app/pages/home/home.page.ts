import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { UtilService } from '../../services/util.service';
import { Router, NavigationExtras } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { CartService } from 'src/app/services/cart.service';
import * as moment from 'moment';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { AlertController } from '@ionic/angular';
import { iif } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})

export class HomePage implements OnInit {

  slideOpts = {
    slidesPerView: 2,
  };
  slideTops = {
    slidesPerView: 2,
    spaceBetween: 5,
    slideShadows: false,
  }
  categories: any[] = [];
  dummyCates: any[] = [];

  dummyBanners: any[] = [];
  banners: any[] = [];

  bottomDummy: any[] = [];
  bottomBanners: any[] = [];

  betweenDummy: any[] = [];
  betweenBanners: any[] = [];

  dummyTopProducts: any[] = [];
  topProducts: any[] = [];

  products: any[] = [];
  dummyProducts: any[] = [];

  haveStores: boolean;

  dummyStores: any[] = [];
  stores: any[] = [];
  terms: any;

  allcates: any[] = [];
  constructor(
    public util: UtilService,
    private router: Router,
    public api: ApiService,
    public cart: CartService,
    private chMod: ChangeDetectorRef,
    private iab: InAppBrowser,
    private alertCtrl: AlertController
  ) {

    this.dummyCates = Array(5);
    this.dummyBanners = Array(5);
    this.bottomDummy = Array(5);
    this.betweenDummy = Array(5);
    this.dummyTopProducts = Array(5);

    this.categories = [];
    this.banners = [];
    this.bottomBanners = [];
    this.betweenBanners = [];
    this.topProducts = [];
    this.products = [];

    this.util.subscribeCity().subscribe((data) => {
      this.dummyCates = Array(5);
      this.dummyBanners = Array(5);
      this.bottomDummy = Array(5);
      this.betweenDummy = Array(5);
      this.dummyTopProducts = Array(5);
      this.allcates = [];
      this.categories = [];
      this.banners = [];
      this.bottomBanners = [];
      this.betweenBanners = [];
      this.topProducts = [];
      this.products = [];
      if (!this.util.appClosed) {
        this.getInit();
      }
    });



  }


  ionViewWillEnter() {

    this.getInit();
    this.dummyCates = Array(5);
    this.dummyBanners = Array(5);
    this.bottomDummy = Array(5);
    this.betweenDummy = Array(5);
    this.dummyTopProducts = Array(5);

    this.categories = [];
    this.banners = [];
    this.bottomBanners = [];
    this.betweenBanners = [];
    this.topProducts = [];
    this.products = [];

    this.util.subscribeCity().subscribe((data) => {
      this.dummyCates = Array(5);
      this.dummyBanners = Array(5);
      this.bottomDummy = Array(5);
      this.betweenDummy = Array(5);
      this.dummyTopProducts = Array(5);
      this.allcates = [];
      this.categories = [];
      this.banners = [];
      this.bottomBanners = [];
      this.betweenBanners = [];
      this.topProducts = [];
      this.products = [];
      if (!this.util.appClosed) {
        this.getInit();
      }
    });


  }



  getDistance(lat1, lon1, lat2, lon2, unit) {
    if ((lat1 == lat2) && (lon1 == lon2)) {
      return 0;
    }
    else {
      var radlat1 = Math.PI * lat1 / 180;
      var radlat2 = Math.PI * lat2 / 180;
      var theta = lon1 - lon2;
      var radtheta = Math.PI * theta / 180;
      var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      if (dist > 1) {
        dist = 1;
      }
      dist = Math.acos(dist);
      dist = dist * 180 / Math.PI;
      dist = dist * 60 * 1.1515;
      if (unit == "K") { dist = dist * 1.609344 }
      if (unit == "N") { dist = dist * 0.8684 }
      return dist;
    }
  }

  getInit() {
    this.getCity();
    this.dummyCates = Array(5);
    this.dummyBanners = Array(5);
    this.bottomDummy = Array(5);
    this.betweenDummy = Array(5);
    this.dummyTopProducts = Array(5);
    // this.dummyProducts = Array(5);
    this.categories = [];
    this.banners = [];
    this.bottomBanners = [];
    this.betweenBanners = [];
    this.topProducts = [];
    this.products = [];
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
          element['isOpen'] = await this.isOpen(element.open_time, element.close_time);
        });

        this.util.active_store = [...new Set(this.stores.map(item => item.uid))];
        console.log('store====>>>', this.stores);
        this.haveStores = true;
        this.getCategorys();
        this.getBanners();

        this.topProducts = [];
        this.dummyTopProducts = Array(5);



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


          this.dummyTopProducts = [];
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
          this.dummyTopProducts = [];
        });


        console.log(param);

      } else {
        this.haveStores = false;
        this.stores = [];
        console.log('no city found');
        this.dummyCates = [];
        this.dummyBanners = [];
        this.bottomDummy = [];
        this.betweenDummy = [];
        this.dummyTopProducts = [];
        this.dummyProducts = [];
        this.categories = [];
        this.banners = [];
        this.bottomBanners = [];
        this.betweenBanners = [];
        this.topProducts = [];
        this.products = [];
        this.chMod.detectChanges();
      }
    }, error => {
      console.log('error in get store by city', error);
      this.stores = [];
      this.haveStores = false;
      this.dummyCates = [];
      this.dummyBanners = [];
      this.bottomDummy = [];
      this.betweenDummy = [];
      this.dummyTopProducts = [];
      this.dummyProducts = [];
      this.categories = [];
      this.banners = [];
      this.bottomBanners = [];
      this.betweenBanners = [];
      this.topProducts = [];
      this.products = [];
      this.util.errorToast(this.util.getString('Something went wrong'));
      this.chMod.detectChanges();
    });
  }

  isOpen(start, end) {
    const format = 'H:mm:ss';
    const ctime = moment().format('HH:mm:ss');
    const time = moment(ctime, format);
    const beforeTime = moment(start, format);
    const afterTime = moment(end, format);

    if (time.isBetween(beforeTime, afterTime)) {
      return true;
    }
    return false
  }

  getTime(time) {

    return moment(time, ['h:mm A']).format('hh:mm A');
  }

  addToCart(item, index) {
    console.log(item);
    this.topProducts[index].quantiy = 1;
    this.cart.addItem(item);
  }

  ngOnInit() {
  }

  getBanners() {
    this.dummyBanners = Array(5);
    this.api.get('banners').subscribe((data: any) => {
      console.log(data);
      this.dummyBanners = [];
      this.betweenDummy = [];
      this.bottomDummy = [];
      this.bottomBanners = [];
      this.betweenBanners = [];
      this.banners = [];
      if (data && data.status === 200 && data.data && data.data.length) {
        data.data.forEach(element => {
          if (element && element.status === '1') {
            if (element.position === '0') {
              this.banners.push(element);
            } else if (element.position === '1') {
              this.bottomBanners.push(element);
            } else {
              this.betweenBanners.push(element);
            }
          }
        });
        console.log('top', this.banners);
        console.log('bottom', this.bottomBanners);
        console.log('between', this.betweenBanners);
      }
    }, error => {
      console.log(error);
      this.dummyBanners = [];
    });
  }

  getQuanity(id) {
    const data = this.cart.cart.filter(x => x.id === id);
    return data[0].quantiy;
  }

  getCategorys() {
    this.dummyCates = Array(10);
    this.api.get('categories').subscribe((datas: any) => {
      this.dummyCates = [];
      const cates = [];
      console.log(datas);

      if (datas && datas.data && datas.data.length) {
        datas.data.forEach(element => {
          if (element.status === '1') {
            const info = {
              id: element.id,
              name: element.name,
              cover: element.cover,
              subCates: []
            }
            const cats = {
              id: element.id,
              name: element.name,
              cover: element.cover,
            }
            this.allcates.push(cats);

            var uniqueNames = [];
            var uniqueObj = [];
            for (var i = 0; i < this.allcates.length; i++) {
              if (uniqueNames.indexOf(this.allcates[i].name) === -1) {
                uniqueObj.push(this.allcates[i])
                uniqueNames.push(this.allcates[i].name);
              }
            }
            console.log(uniqueObj)
            this.allcates = uniqueObj;



            cates.push(info);
          }
        });
      }

      this.api.get('subcate').subscribe((subCates: any) => {
        console.log('sub cates', subCates);
        if (subCates && subCates.status === 200 && subCates.data && subCates.data.length) {
          cates.forEach((element, i) => {
            subCates.data.forEach(sub => {
              if (sub.status === '1' && element.id === sub.cate_id) {

                cates[i].subCates.push(sub);
              }
            });
          });

          this.categories = cates;
        }
      }, error => {
        console.log(error);
        this.util.errorToast(this.util.getString('Something went wrong'));
      });
    }, error => {
      console.log(error);
      this.util.errorToast(this.util.getString('Something went wrong'));
      this.dummyCates = [];
    });
  }

  openMenu() {
    this.util.openMenu();
  }

  add(product, index) {
    console.log(product);
    this.topProducts[index].quantiy = this.getQuanity(product.id);
    if (this.topProducts[index].quantiy > 0) {
      this.topProducts[index].quantiy = this.topProducts[index].quantiy + 1;
      this.cart.addQuantity(this.topProducts[index].quantiy, product.id, product.store_id);
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

  goToSingleProduct(item) {
    const param: NavigationExtras = {
      queryParams: {
        id: item.id

      }
    };

    this.router.navigate(['tabs/home/product'], param);
  }

  goToCatrgory() {
    this.router.navigate(['/tabs/categories']);
  }

  subCate(item) {
    const param: NavigationExtras = {
      queryParams: {
        id: item.id,
        name: item.name
      }
    };
    this.router.navigate(['tabs/home/sub-category'], param);
  }

  changeCity() {
    this.router.navigate(['cities']);
  }

  openLink(item) {
    console.log(item);

    if (item.type === '0') {
      // Category
      console.log('open category');
      const name = this.categories.filter(x => x.id === item.link);
      let cateName: any = '';
      if (name && name.length) {
        cateName = name[0].name
      }
      const param: NavigationExtras = {
        queryParams: {
          id: item.link,
          name: cateName
        }
      };
      this.router.navigate(['tabs/home/sub-category'], param);
    } else if (item.type === '1') {
      // product
      console.log('open product');
      const param: NavigationExtras = {
        queryParams: {
          id: item.link
        }
      };

      this.router.navigate(['tabs/home/product'], param);
    } else {
      // link
      console.log('open link');
      this.iab.create(item.link, '_blank');
    }
  }

  goToProductList(val) {
    const navData: NavigationExtras = {
      queryParams: {
        id: val.id,
        name: val.name,
        from: 'home'
      }
    }
    this.router.navigate(['/tabs/home/products'], navData);
  }

  onSearchChange(event) {
    if (event.detail.value) {
    } else {
      this.products = [];
    }
  }

  getCity() {
    const city = localStorage.getItem('city');
    console.log('selected city===>>', city);
    if (city && city !== null && city !== 'null') {
      const param = {
        id: city
      };

      this.api.post('cities/getById', param).subscribe((data: any) => {
        console.log('selected city', data);
        if (data && data.status === 200 && data.data && data.data.length) {
          const selectedCity = data.data.filter(x => x.status === '1');
          console.log('selected city=======================', selectedCity);
          if (selectedCity && selectedCity.length) {
            this.util.city = selectedCity[0];
            this.chMod.detectChanges();
          } else {
            localStorage.removeItem('city');
          }
        } else {
          localStorage.removeItem('city');
        }
      }, error => {
        console.log(error);
        localStorage.removeItem('city');
      });
    }
  }

  openStore(item) {
    console.log('open store', item);

    const param: NavigationExtras = {
      queryParams: {
        id: item.uid,
        name: item.name
      }
    };
    this.router.navigate(['tabs/home/store'], param);
  }

  topicked() {
    this.router.navigate(['/tabs/home/top-picked']);
  }

  topStores() {
    this.router.navigate(['top-stores']);
  }

  allOffers() {
    this.router.navigate(['all-offers']);
  }


  search(event: string) {
    console.log(event);
    if (event && event !== '') {
      const param = {
        id: localStorage.getItem('city'),
        search: event,
        clat: localStorage.getItem('current_lat'),
        clng: localStorage.getItem('current_lng')
      };
      this.util.show();
      this.api.post('products/getSearchItems', param).subscribe((data: any) => {
        console.log('search data==>', data);
        this.util.hide();
        if (data && data.status === 200 && data.data) {
          this.products = data.data;

          this.products.sort((a, b) => parseFloat(a.km) - parseFloat(b.km));

          var uniqueNames = [];
          var uniqueObj = [];
          for (var i = 0; i < this.products.length; i++) {
            if (uniqueNames.indexOf(this.products[i].name) === -1) {
              uniqueObj.push(this.products[i])
              uniqueNames.push(this.products[i].name);
            }
          }
          this.products = uniqueObj;


        }
      }, error => {
        console.log('error in searhc filess--->>', error);
        this.util.hide();
        this.util.errorToast(this.util.getString('No Search Results'));
      });
    }
  }

  async variant(item, indeX) {
    console.log(item);
    const allData = [];
    console.log(item && item.variations !== '');
    console.log(item && item.variations !== '' && item.variations.length > 0);
    console.log(item && item.variations !== '' && item.variations.length > 0 && item.variations[0].items.length > 0);
    if (item && item.variations !== '' && item.variations.length > 0 && item.variations[0].items.length > 0) {
      console.log('->', item.variations[0].items);
      item.variations[0].items.forEach((element, index) => {
        console.log('OK');
        let title = '';
        if (this.util.cside === 'left') {
          const price = item.variations && item.variations[0] &&
            item.variations[0].items[index] &&
            item.variations[0].items[index].discount ? item.variations[0].items[index].discount :
            item.variations[0].items[index].price;
          title = element.title + ' - ' + this.util.currecny + ' ' + price;
        } else {
          const price = item.variations && item.variations[0] && item.variations[0].items[index] &&
            item.variations[0].items[index].discount ? item.variations[0].items[index].discount :
            item.variations[0].items[index].price;
          title = element.title + ' - ' + price + ' ' + this.util.currecny;
        }
        const data = {
          name: element.title,
          type: 'radio',
          label: title,
          value: index,
          checked: item.variant === index
        };
        allData.push(data);
      });

      console.log('All Data', allData);
      const alert = await this.alertCtrl.create({
        header: item.name,
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
              console.log('before', this.topProducts[indeX].variant);
              this.topProducts[indeX].variant = data;
              console.log('after', this.topProducts[indeX].variant);
            }
          }
        ]
      });

      await alert.present();
    } else {
      console.log('none');
    }

  }

  doRefresh(event) {
    console.log(event);
    this.ionViewWillEnter();

    setTimeout(() => {

      event.target.complete();
    }, 1000);
  }


book(item, index){

  // console.log(item);

  this.cart.cart = [];
  this.cart.itemId = [];

  var i = this.cart.itemId.indexOf(item.id)

  if(i == -1){

    localStorage.setItem('sid', item.store_id)
   
    this.topProducts[index].quantiy = 1;
    this.cart.addItem(item); 
    this.cart.deliveryAt = "home";

    console.log(this.cart)

     this.router.navigate(['tabs/home/address'])

  }else{

    this.remove(item, index);

    localStorage.setItem('sid', item.store_id)
   
    this.topProducts[index].quantiy = 1;
    this.cart.addItem(item); 
    this.cart.deliveryAt = "home";

    console.log(this.cart)

     this.router.navigate(['tabs/home/address'])
    
  }  
}


}



