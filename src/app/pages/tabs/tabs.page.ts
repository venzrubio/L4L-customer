/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : ionic 5 groceryee app
  Created : 10-Sep-2020
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2020-present initappz.
*/
import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { CartService } from 'src/app/services/cart.service';
import { Router } from '@angular/router';
import { UtilService } from 'src/app/services/util.service';

import { EventsService } from 'src/app/events/events.service';
import { ApiService } from 'src/app/services/api.service';





@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  group: any;

  getdata: any;

  count = 0;

  constructor(
    public cart: CartService,
    public util: UtilService,
    private router: Router,
    public api: ApiService,
  

    public event: EventsService
  ) {


    this.event.getObservable().subscribe((data)=>{

      console.log(data)

      if(data.badge == true){

        this.getChatBadge();

        

      }

    })

   
  }


// gotocalendar(){
//   this.router.navigate(['calendar'])
// }

  goToChats() {
    this.router.navigate(['chats']);


  }
  gotocalendar(){
    this.router.navigate(['calendar']);
  }

  ionViewWillEnter() {

    console.log(this.router.url)

    if( this.router.url == '/tabs/orders'){

      this.router.navigate(['/tabs/home']);

    }

   this.getChatBadge();

   this.event.getObservable().subscribe((data) => {
    console.log(data);
    if (!data.onesignaldata.payload.additionalData) {

      console.log('2222')
    } else {

   this.getChatBadge();
      console.log('11111')
    }
  });


  }

  getChatBadge(){

    this.getdata = []; 

    console.log('BADGE !!')

    

    var getByGroup = JSON.parse(localStorage.getItem('getByGroup'))

    if (getByGroup) {
      var getByGroupdata = getByGroup.data

      for (let index = 0; index < getByGroupdata.length; index++) {

        var param = {

          room_id: getByGroupdata[index].room_id,
          uid: getByGroupdata[index].uid,
          from_id: getByGroupdata[index].from_id
         
        }
        console.log(param)
        this.api.post('chats/getChatCountByRoomIdUser', param).subscribe((data: any) => {
          console.log(data)
          if (data.status == 200) {
            this.getdata = data.data.length;
          }
         

        }, error => {
          console.log(error);

        });

      }



    }

   


  }
 



}
