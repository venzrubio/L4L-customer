import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { UtilService } from '../../services/util.service';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { CartService } from 'src/app/services/cart.service';
import * as moment from 'moment';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { AlertController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-store-info',
  templateUrl: './store-info.page.html',
  styleUrls: ['./store-info.page.scss'],
})
export class StoreInfoPage implements OnInit {


uid:any;
stores:any;
storeInfo:any;


  constructor(public util: UtilService,
    private router: Router,
    private route: ActivatedRoute,
    public api: ApiService,
    public cart: CartService,
    private chMod: ChangeDetectorRef,
    private iab: InAppBrowser,
    private alertCtrl: AlertController,
    private navCtrl: NavController
    ) {

      this.route.queryParams.subscribe((data: any) => {
        console.log(data);
        if (data && data.uid) {
        
          this.uid = data.uid;
          this.getstoreInfo();
        }
      })

     }

  ngOnInit() {


  }

  back() {
    this.navCtrl.back();
  }

  getstoreInfo(){




    const param = {
      id: this.uid,
      uid: localStorage.getItem('uid'),
      clat: localStorage.getItem('current_lat'),
      clng: localStorage.getItem('current_lng')
    };

    this.api.post('stores/getByUid', param).subscribe((datas: any) => {
   
      this.stores = datas.data;
      console.log(this.stores)
      this.stores.forEach(async (element) => {
        element['isOpen'] = await this.isOpen(element.open_time, element.close_time);
      });
      console.log('store info...', datas.data[0]);

      this.storeInfo = datas.data[0];
    }, error => {
      console.log(error);
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
}

