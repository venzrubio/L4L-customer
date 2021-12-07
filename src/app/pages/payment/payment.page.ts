/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : ionic 5 groceryee app
  Created : 10-Sep-2020
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2020-present initappz.
*/
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { CartService } from 'src/app/services/cart.service';
import { UtilService } from 'src/app/services/util.service';
import { ApiService } from 'src/app/services/api.service';
import * as moment from 'moment';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.page.html',
  styleUrls: ['./payment.page.scss'],
})
export class PaymentPage implements OnInit {

  Options:any = '';
  havePayment: boolean;
  haveStripe: boolean;
  havePayPal: boolean;
  haveCOD: boolean;
  havePayTM: boolean;
  haveInstamojo: boolean;
  havepayStack: boolean;
  haveflutterwave: boolean;
  paymentdata :any[] = [];
  hideme : any;
  storeids: any[] = [];
  checkoutData: any[] = [];
  getGrandTotal: number = 0;

  instamojo = {
    key: '',
    token: '',
    code: ''
  };
  instaENV: any;
  paystack = {
    pk: '',
    sk: '',
    code: ''
  };
  flutterwave = {
    pk: '',
    code: ''
  };
  haveRazor: boolean;
  razorKey: any;
  testing: any;


  booking_date: any;

  constructor(
    private router: Router,
    private navCtrl: NavController,
    public cart: CartService,
    public util: UtilService,
    public api: ApiService,
    private iab: InAppBrowser,
    private route: ActivatedRoute
  ) 
  {
   
     
  }

  ionViewWillEnter(){
  
    console.log('delivery at', this.cart.deliveryAt);
    this.util.getCouponObservable().subscribe((data) => {
      console.log(data);
      this.cart.calcuate();
      console.log(this.cart.discount);
      this.getCheckoutData();
    }, error => {
      console.log(error);
    });
   
    this.getCheckoutData();

   this.storeids = this.cart.cart;

   console.log(this.storeids);



   this.route.queryParams.subscribe((params: any) => {

    this.booking_date = params.booked_date
});
 

  }



  ngOnInit() {




   this.Options = localStorage.getItem('Option')



    console.log(this.cart.cart[0]);

var store_id = this.cart.cart[0].store_id;

    const param = {
      uid:store_id
    }
    this.api.post('stores/getStorePM', param).subscribe((data: any) => {
      

      this.paymentdata = data.data;
  

      console.log(this.paymentdata)
    }, error => {
      console.log(error);
      this.util.hide();
      this.util.showToast(this.util.getString('Something went wrong'), 'danger', 'bottom');
    });


  }

  proceed() {
    // this.util.errorToast('ongoing');
    const options: InAppBrowserOptions = {
      location: 'no',
      clearcache: 'yes',
      zoom: 'yes',
      toolbar: 'yes',
      closebuttoncaption: 'close'
    };
    const param = {
      key: this.razorKey,
      amount: this.cart.grandTotal ? this.cart.grandTotal * 100 : 5,
      email: this.getEmail(),
      logo: this.api.mediaURL + this.util.logo
    }
    // console.log('to url===>', this.api.JSON_to_URLEncoded(param))
    const url = this.api.baseUrl + 'razorpay?' + this.api.JSON_to_URLEncoded(param);
    const browser: any = this.iab.create(url, '_blank', options);
    browser.on('loadstop').subscribe(event => {
      console.log('event?;>11', event);
      const navUrl = event.url;
      if (navUrl.includes('success')) {
        console.log('close');
        browser.close();
        const urlItems = new URL(event.url);
        const orderId = urlItems.searchParams.get('id');
        this.makeOrder('razorpay', orderId);
      }
    });
  }

  cardInfo(val) {

  }

  openStripe() {
    this.router.navigate(['tabs/cart/stripe-payments']);
  }
  openpaymongo() {
    this.router.navigate(['tabs/cart/paymongo-payment']);
  }

  goToSucess() {
    this.router.navigate(['/success']);
  }

  back() {
    this.navCtrl.back();
  }
  openCoupon() {
    this.router.navigate(['offers']);
  }

  async getCheckoutData(){

    this.checkoutData =  [];
    
    const storeId = [...new Set(this.cart.cart.map(item => item.store_id))];
    var orderStatus;
    var extraChargeParam;
    var distance;

    const notes = [
      {
        status: 1,
        value: 'Order Created',
        time: moment().format('lll'),
      }
    ];

    for (let index = 0; index < storeId.length; index++) {
      const info = {
            id: storeId[index],
            status: 'created'
          }
          orderStatus = info;
      
      var findItemTotal = this.cart.cart.filter(item => item.store_id == storeId[index]);

      let total = 0;
     findItemTotal.forEach(element => {
        if (element && element.discount === '0') {
          if (element.size === '1' || element.size === 1) {
            if (element.variations[0].items[element.variant].discount && element.variations[0].items[element.variant].discount !== 0) {
              total = total + (parseFloat(element.variations[0].items[element.variant].discount) * element.quantiy);
            } else {
              total = total + (parseFloat(element.variations[0].items[element.variant].price) * element.quantiy);
              }
          } else {
            total = total + (parseFloat(element.original_price) * element.quantiy);
          }
        } else {
          if (element.size === '1' || element.size === 1) {
            if (element.variations[0].items[element.variant].discount && element.variations[0].items[element.variant].discount !== 0) {
              total = total + (parseFloat(element.variations[0].items[element.variant].discount) * element.quantiy);
            } else {
              total = total + (parseFloat(element.variations[0].items[element.variant].price) * element.quantiy);
            }
          } else {
            total = total + (parseFloat(element.sell_price) * element.quantiy);
          }
        }
      });
      console.log('total->', total);
      
      for (let stores = 0; stores < this.cart.stores.length; stores++) {
        if(this.cart.deliveryAddress && this.cart.deliveryAt === 'home'){
           distance = await this.distanceInKmBetweenEarthCoordinates(this.cart.deliveryAddress.lat, this.cart.deliveryAddress.lng,
            this.cart.stores[stores].lat, this.cart.stores[stores].lng);
            this.cart.orderTax = this.cart.orderTax;
        }else{
          distance = 0;
          this.cart.minimumDeliveryRate = 0;
          this.cart.orderTax = this.cart.pickupServiceCharge;
        }

console.log(this.cart.stores[stores].lat)
console.log("Distance-======",distance);

          if(distance <= this.cart.minimumDeliveryDistance){

            const extraCharge = {
              store_id:  this.cart.stores[stores].uid,
              d_charge: this.cart.minimumDeliveryRate
            };
  
            if(extraCharge.store_id == storeId[index]){
                extraChargeParam = extraCharge.d_charge;
            }
            console.log("IF-==========", extraCharge)

           

          }else {

            var minRate = this.cart.minimumDeliveryRate;
            var minDistance = this.cart.minimumDeliveryDistance;
  
            var getDistance = distance - minDistance;
            var getDeliveryCharge = getDistance * this.cart.shippingPrice;
           
            console.log(getDeliveryCharge)
  
           const extraCharge = {
              store_id:  this.cart.stores[stores].uid,
              d_charge: minRate + getDeliveryCharge
            };
  
            if(extraCharge.store_id == storeId[index]){
                extraChargeParam = extraCharge.d_charge;
            }
            console.log("Else-=========",extraCharge)

          }
       
      }

      // var grandTotal = (total - parseFloat(this.cart.discount)) + this.cart.orderTax + Math.floor(extraChargeParam);
      var grandTotal = (total - parseFloat(this.cart.discount)) + this.cart.orderTax;
      var findStoreName = this.cart.cart.filter(item => item.store_id == storeId[index]);

      var uniqueNames = [];
      var uniqueObj = [];
      for(var i = 0; i< findStoreName.length; i++){    
          if(uniqueNames.indexOf(findStoreName[i].store_id) === -1){
              uniqueObj.push(findStoreName[i])
              uniqueNames.push(findStoreName[i].store_name);        
          }        
      }

      var uniqueObjName = [];
      var uniqueObj1 = [];
      for(var ii = 0; ii< uniqueNames.length; ii++){    
          if(uniqueObjName.indexOf(uniqueNames[ii]) === -1){
              uniqueObj1.push(uniqueNames[ii])
              uniqueObjName.push(uniqueNames[ii]);        
          }        
      }

      const param = {
      uid: localStorage.getItem('uid'),
      store_id: storeId[index],
      date_time: this.cart.datetime === 'today' ? moment().format('YYYY-MM-DD HH:mm:ss') : moment().add(1, 'days').format('YYYY-MM-DD HH:mm:ss'),
      order_to: this.cart.deliveryAt,
      orders: JSON.stringify(this.cart.cart.filter(item => item.store_id == storeId[index])),
      store_name: uniqueObjName[0],
      notes: JSON.stringify(notes),
      // address: this.cart.deliveryAt === 'home' ? JSON.stringify(this.cart.deliveryAddress) : '',
      address: JSON.stringify(this.cart.deliveryAddress),
      driver_id: '',
      total: total,
      tax: this.cart.orderTax,
      grand_total: grandTotal,
      // delivery_charge: Math.floor(extraChargeParam),
      delivery_charge: 0,
      coupon_code: this.cart.coupon ? JSON.stringify(this.cart.coupon) : '',
      discount: this.cart.discount,
      pay_key: '',
      status:  JSON.stringify(orderStatus),
      assignee: '',
      extra: JSON.stringify(this.cart.userOrderTaxByStores)
    }

    console.log(param)
    this.checkoutData.push(param);

    var gtotal = 0;

    for (let t = 0; t < this.checkoutData.length; t++) {
     gtotal += this.checkoutData[t].grand_total;
     this.getGrandTotal = gtotal;
    }
    console.log(this.checkoutData);
    }
  }

  degreesToRadians(degrees) {
    return degrees * Math.PI / 180;
  }

  distanceInKmBetweenEarthCoordinates(lat1, lon1, lat2, lon2) {
    // console.log(lat1, lon1, lat2, lon2);
    const earthRadiusKm = 6371;

    const dLat = this.degreesToRadians(lat2 - lat1);
    const dLon = this.degreesToRadians(lon2 - lon1);

    lat1 = this.degreesToRadians(lat1);
    lat2 = this.degreesToRadians(lat2);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return earthRadiusKm * c;
  }


  async createOrder(paymentmethod) {

    console.log(paymentmethod);
 
    const storeId = [...new Set(this.cart.cart.map(item => item.store_id))];
    var orderStatus;
    var extraChargeParam;
    var distance;

    const notes = [
      {
        status: 1,
        value: 'Order Created',
        time: moment().format('lll'),
      }
    ];

    for (let index = 0; index < storeId.length; index++) {
      const info = [{
            id: storeId[index],
            status: 'created'
          }]
          orderStatus = info;
      
      var findItemTotal = this.cart.cart.filter(item => item.store_id == storeId[index]);

      console.log(findItemTotal)

      let total = 0;
     findItemTotal.forEach(element => {
        if (element && element.discount === '0') {
          if (element.size === '1' || element.size === 1) {
            if (element.variations[0].items[element.variant].discount && element.variations[0].items[element.variant].discount !== 0) {
              total = total + (parseFloat(element.variations[0].items[element.variant].discount) * element.quantiy);
            } else {
              total = total + (parseFloat(element.variations[0].items[element.variant].price) * element.quantiy);
              }
          } else {
            total = total + (parseFloat(element.original_price) * element.quantiy);
          }
        } else {
          if (element.size === '1' || element.size === 1) {
            if (element.variations[0].items[element.variant].discount && element.variations[0].items[element.variant].discount !== 0) {
              total = total + (parseFloat(element.variations[0].items[element.variant].discount) * element.quantiy);
            } else {
              total = total + (parseFloat(element.variations[0].items[element.variant].price) * element.quantiy);
            }
          } else {
            total = total + (parseFloat(element.sell_price) * element.quantiy);
          }
        }
      });
      console.log('total->', total);

      for (let stores = 0; stores < this.cart.stores.length; stores++) {
        if(this.cart.deliveryAddress && this.cart.deliveryAt === 'home'){
          distance = await this.distanceInKmBetweenEarthCoordinates(this.cart.deliveryAddress.lat, this.cart.deliveryAddress.lng,
           this.cart.stores[stores].lat, this.cart.stores[stores].lng);
           this.cart.orderTax = this.cart.orderTax;
       }else{
         distance = 0;
         this.cart.minimumDeliveryRate = 0;
         this.cart.orderTax = this.cart.pickupServiceCharge;
       }

       if(distance <= this.cart.minimumDeliveryDistance){

        const extraCharge = {
          store_id:  this.cart.stores[stores].uid,
          d_charge: this.cart.minimumDeliveryRate
        };

        if(extraCharge.store_id == storeId[index]){
            extraChargeParam = extraCharge.d_charge;
        }
        console.log("IF-==========", extraCharge)
        
      }else {

        var minRate = this.cart.minimumDeliveryRate;
        var minDistance = this.cart.minimumDeliveryDistance;
        
        var getDistance = distance - minDistance;
        var getDeliveryCharge = getDistance * this.cart.shippingPrice;

        console.log(getDeliveryCharge)

       const extraCharge = {
          store_id:  this.cart.stores[stores].uid,
          d_charge: minRate + getDeliveryCharge
        };

        if(extraCharge.store_id == storeId[index]){
            extraChargeParam = extraCharge.d_charge;
        }
        console.log("Else-=========",extraCharge)

      }

     
      }

      // var grandTotal = (total - parseFloat(this.cart.discount)) + this.cart.orderTax + Math.floor(extraChargeParam);

      var grandTotal = (total - parseFloat(this.cart.discount)) + this.cart.orderTax;

      // var findStoreName = this.cart.cart.filter(item => item.store_id == storeId[index]);

      // var uniqueNames = [];
      // var uniqueObj = [];
      // for(var i = 0; i< findStoreName.length; i++){    
      //     if(uniqueNames.indexOf(findStoreName[i].store_id) === -1){
      //         uniqueObj.push(findStoreName[i])
      //         uniqueNames.push(findStoreName[i].store_name);        
      //     }        
      // }

      // var uniqueObjName = [];
      // var uniqueObj1 = [];
      // for(var ii = 0; ii< uniqueNames.length; ii++){    
      //     if(uniqueObjName.indexOf(uniqueNames[ii]) === -1){
      //         uniqueObj1.push(uniqueNames[ii])
      //         uniqueObjName.push(uniqueNames[ii]);        
      //     }        
      // }

      const param = {
      uid: localStorage.getItem('uid'),
      store_id: storeId[index],
      date_time: this.cart.datetime === 'today' ? moment().format('YYYY-MM-DD HH:mm:ss') : moment().add(1, 'days').format('YYYY-MM-DD HH:mm:ss'),
      paid_method: paymentmethod,
      order_to: this.cart.deliveryAt,
      orders: JSON.stringify(this.cart.cart.filter(item => item.store_id == storeId[index])),
      notes: JSON.stringify(notes),
      address: this.cart.deliveryAt === 'home' ? JSON.stringify(this.cart.deliveryAddress) : '',
      driver_id: '',
      total: total,
      tax: this.cart.orderTax,
      grand_total: grandTotal,
      delivery_charge: 0,
      coupon_code: this.cart.coupon ? JSON.stringify(this.cart.coupon) : '',
      discount: this.cart.discount,
      pay_key: '',
      status:  JSON.stringify(orderStatus),
      assignee: '',
      extra: JSON.stringify(this.cart.userOrderTaxByStores)
    }

    console.log(param)

    this.util.show();
    this.api.post('orders/save', param).subscribe((data: any) => {
      console.log(data);

      if(data.status == 200){

        var calendar = JSON.parse(localStorage.getItem('booked'));

        console.log(calendar);
        // BOOKED 
        var param = {
          sid: localStorage.getItem('sid'),
          booking_date: calendar.booking_date,
          start: new Date(calendar.startTime).toLocaleDateString(),
          end: new Date(calendar.endTime).toLocaleDateString(),
          t_start: calendar.t_start,
          t_end: calendar.t_end,
          description: calendar.desc
        }

        console.log(param)
      
      
        this.api.post('stores/saveBooking', param).subscribe((res)=>{

         
          this.util.hide();

          console.log(this.cart.stores);
    
          this.api.createOrderNotification(this.cart.stores);
          this.cart.clearCart();
          this.util.publishNewOrder();
          // this.navCtrl.navigateRoot(['/tabs/orders'], { replaceUrl: true, skipLocationChange: true });

          this.router.navigate(['/tabs/orders']);


          // this.myCal.loadEvents();

        }, error => {

          console.log(error);
          this.util.hide();
          this.util.showToast(this.util.getString('Something went wrong'), 'danger', 'bottom');
        } 
        )
      }
    }, error => {
      console.log(error);
      this.util.hide();
      this.util.showToast(this.util.getString('Something went wrong'), 'danger', 'bottom');
    });
    }

   
  }

  async makeOrder(method, key) {
    
    console.log(method);
 
    const storeId = [...new Set(this.cart.cart.map(item => item.store_id))];
    const orderStatus = [];
    storeId.forEach(element => {
      const info = {
        id: element,
        status: 'created'
      }
      orderStatus.push(info)
    });
    const notes = [
      {
        status: 1,
        value: 'Order Created',
        time: moment().format('lll'),
      }
    ];
    const param = {
      uid: localStorage.getItem('uid'),
      store_id: storeId.join(),
      date_time: this.cart.datetime === 'today' ? moment().format('YYYY-MM-DD HH:mm:ss') : moment().add(1, 'days').format('YYYY-MM-DD HH:mm:ss'),
      paid_method: method,
      order_to: this.cart.deliveryAt,
      orders: JSON.stringify(this.cart.cart),
      notes: JSON.stringify(notes),
      address: this.cart.deliveryAt === 'home' ? JSON.stringify(this.cart.deliveryAddress) : '',
      driver_id: '',
      total: this.cart.totalPrice,
      tax: this.cart.orderTax,
      grand_total: this.cart.grandTotal,
      delivery_charge: this.cart.deliveryPrice,
      coupon_code: this.cart.coupon ? JSON.stringify(this.cart.coupon) : '',
      discount: this.cart.discount,
      pay_key: key,
      status: JSON.stringify(orderStatus),
      assignee: '',
      extra: JSON.stringify(this.cart.userOrderTaxByStores)
    }

    console.log('param----->', param);

    this.util.show();
    this.api.post('orders/save', param).subscribe((data: any) => {
      console.log(data);
      this.util.hide();
      this.api.createOrderNotification(this.cart.stores);
      this.cart.clearCart();
      this.util.publishNewOrder();
      this.navCtrl.navigateRoot(['/tabs/orders'], { replaceUrl: true, skipLocationChange: true });
    }, error => {
      console.log(error);
      this.util.hide();
      this.util.showToast(this.util.getString('Something went wrong'), 'danger', 'bottom');
    });
  }


  paypalPayment() {
    const options: InAppBrowserOptions = {
      location: 'no',
      clearcache: 'yes',
      zoom: 'yes',
      toolbar: 'yes',
      closebuttoncaption: 'close'
    };
    const param = {
      uid: localStorage.getItem('uid'),
      itemName: 'groceryee',
      grandTotal: this.cart.grandTotal,
      dateTime: moment().format('YYYY-MM-DD HH:mm'),
      logo: this.api.mediaURL + this.util.logo
    }
    console.log('to url===>', this.api.JSON_to_URLEncoded(param))
    const url = this.api.baseUrl + 'paypal/buyProduct?' + this.api.JSON_to_URLEncoded(param);
    const browser: any = this.iab.create(url, '_blank', options);
    browser.on('loadstop').subscribe(event => {
      console.log('event?;>11', event);
      const navUrl = event.url;
      if (navUrl.includes('success') || navUrl.includes('checkout/done')) {
        console.log('close');
        browser.close();
        this.makeOrder('paypal', 'fromApp');
      }
    });
  }

  flutterpay() {
    const options: InAppBrowserOptions = {
      location: 'no',
      clearcache: 'yes',
      zoom: 'yes',
      toolbar: 'yes',
      closebuttoncaption: 'close'
    };
    const param = {
      key: this.flutterwave.pk,
      amount: this.cart.grandTotal,
      email: this.getEmail(),
      phone: this.util.userInfo.mobile,
      name: this.getName(),
      code: this.flutterwave.code,
      logo: this.api.mediaURL + this.util.logo
    }
    console.log('to url===>', this.api.JSON_to_URLEncoded(param))
    const url = this.api.baseUrl + 'flutterwave?' + this.api.JSON_to_URLEncoded(param);
    const browser: any = this.iab.create(url, '_blank', options);
    browser.on('loadstop').subscribe(event => {
      console.log('event?;>11', event);
      const navUrl = event.url;
      if (navUrl.includes('success') || navUrl.includes('closed')) {
        console.log('close');
        browser.close();
        if (navUrl.includes('success')) {
          const urlItems = new URL(event.url);
          const orderId = urlItems.searchParams.get('transaction_id');
          this.makeOrder('flutterwave', orderId);
        }

      }
    });
  }

  paystackPay() {
    const options: InAppBrowserOptions = {
      location: 'no',
      clearcache: 'yes',
      zoom: 'yes',
      toolbar: 'yes',
      closebuttoncaption: 'close'
    };
    const paykey = '' + Math.floor((Math.random() * 1000000000) + 1);
    const param = {
      key: this.paystack.pk,
      email: this.util.userInfo.email,
      amount: this.cart.grandTotal * 100,
      firstname: this.util.userInfo.first_name,
      lastname: this.util.userInfo.last_name,
      ref: paykey
    }
    console.log('to url===>', this.api.JSON_to_URLEncoded(param))
    const url = this.api.baseUrl + 'paystack?' + this.api.JSON_to_URLEncoded(param);
    const browser: any = this.iab.create(url, '_blank', options);
    browser.on('loadstop').subscribe(event => {
      console.log('event?;>11', event);
      const navUrl = event.url;
      if (navUrl.includes('success') || navUrl.includes('close')) {
        console.log('close');
        browser.close();
        if (navUrl.includes('success')) {
          console.log('closed---->>>>>')
          this.makeOrder('paystack', paykey);
        } else {
          console.log('closed');
        }
      }
    });
  }
  paytm() {
    const options: InAppBrowserOptions = {
      location: 'no',
      clearcache: 'yes',
      zoom: 'yes',
      toolbar: 'yes',
      closebuttoncaption: 'close'
    };
    const orderId = this.util.makeid(20);
    const param = {
      ORDER_ID: orderId,
      CUST_ID: localStorage.getItem('uid'),
      INDUSTRY_TYPE_ID: 'Retail',
      CHANNEL_ID: 'WAP',
      TXN_AMOUNT: this.cart.grandTotal ? this.cart.grandTotal : 5
    }
    console.log('to url===>', this.api.JSON_to_URLEncoded(param))
    const url = this.api.baseUrl + 'paytm/pay?' + this.api.JSON_to_URLEncoded(param);
    const browser: any = this.iab.create(url, '_blank', options);
    browser.on('loadstop').subscribe(event => {
      console.log('event?;>11', event);
      const navUrl = event.url;
      if (navUrl.includes('success')) {
        console.log('close');
        browser.close();
        this.makeOrder('paytm', orderId);
      }
    });
  }

  getName() {
    return this.util.userInfo && this.util.userInfo.first_name ? this.util.userInfo.first_name + ' ' + this.util.userInfo.last_name : 'Groceryee';
  }

  getEmail() {
    return this.util.userInfo && this.util.userInfo.email ? this.util.userInfo.email : 'info@groceryee.com';
  }

  instaPay() {
    let url;
    if (this.instaENV === '0') {
      url = 'https://test.instamojo.com/api/1.1/payment-requests/'
    } else {
      url = 'https://www.instamojo.com/api/1.1/payment-requests/';
    };

    const param = {
      allow_repeated_payments: 'False',
      amount: this.cart.grandTotal,
      buyer_name: this.getName(),
      purpose: 'Groceryee order',
      redirect_url: this.api.baseUrl + 'paypal/success',
      phone: this.util.userInfo && this.util.userInfo.mobile ? this.util.userInfo.mobile : '',
      send_email: 'True',
      webhook: this.api.baseUrl,
      send_sms: 'True',
      email: this.getEmail()
    };

    this.util.show();
    this.api.instaPay(url, param, this.instamojo.key, this.instamojo.token).then((data: any) => {
      console.log(data);
      this.util.hide();
      console.log(JSON.parse(data.data));
      const info = JSON.parse(data.data);
      console.log('data.status', data.status);
      if (data.status === 201 && info && info.success === true) {
        const options: InAppBrowserOptions = {
          location: 'no',
          clearcache: 'yes',
          zoom: 'yes',
          toolbar: 'yes',
          closebuttoncaption: 'close'
        };
        const browser: any = this.iab.create(info.payment_request.longurl, '_blank', options);
        browser.on('loadstop').subscribe(event => {
          const navUrl = event.url;
          console.log('navURL', navUrl);
          if (navUrl.includes('success')) {
            browser.close();
            const urlItems = new URL(event.url);
            console.log(urlItems);
            const orderId = urlItems.searchParams.get('payment_id');
            this.makeOrder('instamojo', orderId);
          }
        });
      } else {
        const error = JSON.parse(data.error);
        console.log('error message', error);
        if (error && error.message) {
          this.util.showToast(error.message, 'danger', 'bottom');
          return false;
        }
        this.util.showToast(this.util.getString('Something went wrong'), 'danger', 'bottom');
      }
    }, error => {
      console.log(error);
      this.util.hide();
      const message = JSON.parse(error.error);
      console.log('error message', message);
      if (message && message.message) {
        this.util.showToast(message.message, 'danger', 'bottom');
        return false;
      }
      this.util.showToast(this.util.getString('Something went wrong'), 'danger', 'bottom');
    }).catch(error => {
      console.log(error);
      this.util.hide();
      const message = JSON.parse(error.error);
      console.log('error message', message);
      if (message && message.message) {
        this.util.showToast(message.message, 'danger', 'bottom');
        return false;
      }
      this.util.showToast(this.util.getString('Something went wrong'), 'danger', 'bottom');
    })
  }



}

