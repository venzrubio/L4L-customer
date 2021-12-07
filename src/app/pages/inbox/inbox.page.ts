/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : ionic 5 groceryee app
  Created : 10-Sep-2020
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2020-present initappz.
*/
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, IonContent } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';
import * as moment from 'moment';
import { EventsService } from 'src/app/events/events.service';


@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.page.html',
  styleUrls: ['./inbox.page.scss'],
})
export class InboxPage implements OnInit {
  @ViewChild(IonContent, { read: IonContent, static: false }) myContent: IonContent;

  id: any;
  name: any;
  msg: any = '';
  messages: any[] = [];
  uid: any;
  loaded: boolean;
  yourMessage: boolean;
  interval: any;
  data: any[] = [];
  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    public api: ApiService,
    public util: UtilService,
    public events: EventsService
  ) {
    this.route.queryParams.subscribe((data: any) =>  {
      console.log(data);
    
      if (data && data.id && data.name) {
        // this.uid = data.uid;
        this.uid = localStorage.getItem('uid');
        this.id = data.id;
        this.loaded = false;
        this.name = data.name;
        this.data.push(data);
        console.log(this.data)
        this.getChats();
        this.interval = setInterval(() => {
          console.log('calling in interval');
          this.getChats();
        }, 60000);
      } else {
        this.navCtrl.back();
      }
    });
  }

  ionViewDidLeave() {
    console.log('leaae');
    clearInterval(this.interval);
  }
  // ScrollToBottom() {

  // }
  ngOnInit() {
  }

  getChats() {
    // store _ opponent
    const param = {
      id: this.id + '_' + this.uid,
      oid: this.id
    };
    this.api.post('chats/getById', param).subscribe((data: any) => {
      console.log(data);
      this.loaded = true;
      this.yourMessage = true;
      if (data && data.status === 200) {
        this.messages = data.data;
        this.myContent.scrollToBottom(300);
      }
    }, error => {
      console.log(error);
      this.loaded = true;
      this.yourMessage = true;
      this.util.errorToast(this.util.getString('Something went wrong'));
    });
  }

  back() {
    this.navCtrl.back();

    var a = {inbox: 'triggerionViewWillEnter',
            badge: true};

    this.events.publishSomeData(a);
    // this.navCtrl.navigateRoot('tabs/chat')



  }

  sendMessage() {
    // store to opponent
    console.log(this.msg);
    if (!this.msg || this.msg === '') {
      return false;
    }
    const msg = this.msg;
    this.msg = '';
    const param = {
      room_id: this.id,
      uid: this.id + '_' + this.uid,
      from_id: this.uid,
      message: msg,
      message_type: 'users',
      status: 1,
      timestamp: moment().format('YYYY-MM-DD HH:mm:ss')
    };
    this.myContent.scrollToBottom(300);
    this.yourMessage = false;
    this.api.post('chats/save', param).subscribe((data: any) => {
var customerName = JSON.parse(localStorage.getItem('userData'))

    this.api.createChatNotification(this.data, msg, customerName.first_name); 
      
      // console.log(customerName.firstname);
      if (data && data.status === 200) {
        this.getChats();
      } else {
        this.yourMessage = true;
      }
    }, error => {
      console.log(error);
      this.yourMessage = true;
      this.util.errorToast(this.util.getString('Something went wrong'));
    });
  }

}
