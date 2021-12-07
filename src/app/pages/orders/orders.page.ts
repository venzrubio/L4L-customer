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
import { UtilService } from '../../services/util.service';
import { Router, NavigationExtras } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import * as moment from 'moment';
import { EventsService } from 'src/app/events/events.service';
import { AlertController } from '@ionic/angular';



@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
})
export class OrdersPage implements OnInit {

  dummy: any[] = [];
  orders: any[] = [];
  current: any[] = [];
  history: any []= [];
  Orders:any[] =[];

  pet = 1;
  intr: any;
  constructor(
    public util: UtilService,
    private router: Router,
    public api: ApiService,
    public eventservice: EventsService,
    private alertController: AlertController
    ) {
      // this.getOrders('', false);
      this.util.subscribeOrder().subscribe((data) => {
        this.getOrders('', false);
      });
  }


  ngOnInit() {


  


  }

  ionViewWillLeave(){

    // console.log('na wala nako!')

    clearInterval(this.intr);

  }





  ionViewWillEnter() {

    this.eventservice.getObservable().subscribe((data) => {

      console.log(data);
      if (!data.onesignaldata.payload.additionalData) {


        // clearInterval(this.intr);

        // this.ionViewWillEnter();
        this.getOrders('', false);
        console.log('2222')
      } else {

        this.getOrders('', false);
        console.log('11111')
        
      
      }
    });

    // this.current = [];
    // this.history = [];
    this.util.hide();
    this.getOrders('', false);
    
    this.intr = setInterval(() => {
      this.getOrders('', false);

    }, 60000);
  }

  getOrders(event, haveRefresh) {


    this.dummy = Array(15);
    this.orders = [];
    this.current = [];
    this.history = [];
    this.Orders =[];
   


    const param = {
      id: localStorage.getItem('uid'),
      clat: localStorage.getItem('current_lat'),
      clng: localStorage.getItem('current_lng')

    }


   
    this.api.post('orders/getByUid', param).subscribe((data: any) => {
      console.log(data);
      this.dummy = [];
      if (data && data.status === 200 && data.data.length > 0) {
        // this.orders = data.data;
        this.Orders = data.data;
        
        this.Orders.forEach(element => {
          if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false } })(element.orders)) {
            element.orders = JSON.parse(element.orders);
            element.date_time = moment(element.date_time).format('dddd, MMMM Do YYYY');
            element.orders.forEach(order => {
              // console.log(element.id, '=>', order.variations);
              if (order.variations && order.variations !== '' && typeof order.variations === 'string') {
                // console.log('strings', element.id);
                order.variations = JSON.parse(order.variations);
                // console.log(order['variant']);
                if (order["variant"] === undefined) {
                  order['variant'] = 0;
                }
              }
            });

           

            var a = JSON.parse(element.status);

            // console.log(a);

            if(a[0].status == 'created' || a[0].status === 'accepted' || a[0].status === 'ongoing' || a[0].status === 'delivered by driver'){

              this.current.push(element);
                this.util.hide();

              // console.log(this.current)

            } else if (a[0].status === 'cancelled' || a[0].status === 'rejected' || a[0].status === 'delivered') {

              this.history.push(element);
              this.util.hide();

            }


          }

        });

        this.orders = this.Orders;

      

        if (haveRefresh) {
          event.target.complete();
        }
        // console.log('orderss==>?', this.orders);
      }
    }, error => {
      // console.log(error);
      this.dummy = [];
      this.orders = [];
      this.util.errorToast(this.util.getString('Something went wrong'));
    });
  }

  openMenu() {
    this.util.openMenu();
  }

  goToOrder(val) {
    const navData: NavigationExtras = {
      queryParams: {
        id: val.id
      }
    }
    this.router.navigate(['/order-details'], navData);
  }

  doRefresh(event) {

    // console.log(event);
    this.getOrders(event, true);
    
    setTimeout(() => {

      event.target.complete();
    }, 1000);
  }

  getOrderStatus(status) {
   var getStatus = JSON.parse(status);
   var s = getStatus[0]

  // console.log(s);

    if(s.status == 'created') {
      return 'requested';
      
    } else {
      return s.status;
    }


 }


 async test(){


  const alert = await this.alertController.create({
    cssClass: 'my-custom-class',
    header: 'Alert',
    subHeader: 'Subtitle',
    message: 'This is an alert message.',
    buttons: ['OK']
  });

  await alert.present();

  const { role } = await alert.onDidDismiss();
  console.log('onDidDismiss resolved with role', role);


 }

}