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
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';
import { Router, NavigationExtras } from '@angular/router';
import { NavController } from '@ionic/angular';
import { computeStackId } from '@ionic/angular/directives/navigation/stack-utils';
import { EventsService } from 'src/app/events/events.service';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.page.html',
  styleUrls: ['./chats.page.scss'],
})
export class ChatsPage implements OnInit {

  dummy: any[] = [];
  users: any[] = [];
  getdata:any;
  
  constructor(
    public api: ApiService,
    public util: UtilService,
    private router: Router,
    private navCtrl: NavController,
    public events: EventsService
  ) {


    this.events.getObservable().subscribe((data)=>{

      console.log(data);

      if(data.inbox == 'triggerionViewWillEnter'){

        this.ionViewWillEnter();

      }

    })
   
   
  }


  ionViewWillEnter(){
    console.log('test!')
    this.getChats();



    this.events.getObservable().subscribe((data) => {
      console.log(data);
      if (!data.onesignaldata.payload.additionalData) {

        console.log('2222')
      } else {

  
    this.getcountgroup(data);

        console.log('11111')

      }
    });




  }

  getChats() {
    const param = {
      id: localStorage.getItem('uid')
    };
    this.dummy = Array(10);
    this.api.post('chats/getByGroup', param).subscribe((data: any) => {
      console.log(data);
      if (data && data.status === 200) {
        const info = [];
        data.data.forEach(element => {
          info.push(element.from_id);
          info.push(element.room_id);
        });
        let uniq = [...new Set(info)];
        uniq = uniq.filter(x => x !== localStorage.getItem('uid'));
        console.log('uniq->>', uniq);
        const uid = {
          id: uniq.join()
        };
        this.api.post('stores/getChatsNames', uid).subscribe((uids: any) => {

          console.log(uids.data);
           var chatdata = uids.data

          for (let index = 0; index < chatdata.length; index++) {
            for (let i = 0; i < chatdata[index].chat_data.length; i++) {
          
            var param = {
        
              room_id: chatdata[index].chat_data[i].room_id,
              uid: chatdata[index].chat_data[i].uid,
              // type: chatdata[index].chat_data[i].message_type
            }
            this.api.post('chats/getChatCountByMessageUser', param).subscribe((data: any) => {
              console.log(data)
              this.getdata = data.data[0].total_count;
         
            }, error => {
              console.log(error);
            
            });
            }
          }

          this.dummy = [];
          console.log(uids);
          if (uids && uids.status === 200) {
            this.users = uids.data;
            console.log(this.users)
          }
        }, error => {
          console.log(error);
          this.users = [];
          this.dummy = [];
          this.util.errorToast(this.util.getString('Something went wrong'));
        });
      } else {
        this.dummy = [];
      }
    }, error => {
      console.log(error);
      this.util.errorToast(this.util.getString('Something went wrong'));
    });
  }
  ngOnInit() {
  }

  back() {
    this.navCtrl.back();
  }

  onAdmin() {
    const param: NavigationExtras = {
      queryParams: {
        id: 0,
        name: 'Support',
        uid: localStorage.getItem('uid')
      }
    };
    this.router.navigate(['inbox'], param);
  }

  onChat(item, update) {
    console.log(item)
    console.log(update)
    console.log(localStorage.getItem('uid'));
    const param: NavigationExtras = {
      queryParams: {
        id: item.id,
        name: item.name,
        uid: localStorage.getItem('uid'),
        player_id: item.player_id
      }
    };


 if(update != ''){


  var params =  {
    room_id: update[0].room_id,
    uid: update[0].uid,
    message_type: update[0].message_type,
    isSeen: '1'

} 
this.api.post('chats/updateisSeenMessage', params).subscribe((data: any) => { 

console.log(data)
});
 }
    this.router.navigate(['inbox'], param);
  }

  getcountgroup(data){
    
    console.log(data)

    this.getdata = []

      
        for (let index = 0; index < data.length; index++) {
          
          var param = {
      
            room_id: data[index].room_id,
            uid: data[index].uid,
            type: data[index].message_type
          }
          this.api.post('chats/getChatCountByMessage', param).subscribe((data: any) => {
            this.getdata = data.data[0].total_count;
       
          }, error => {
            console.log(error);
          
          });
         
        }
        
      return this.getdata;
  }



}
