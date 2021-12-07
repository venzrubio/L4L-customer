import { Component, OnInit ,AfterViewInit, Input } from '@angular/core';
import { AlertController, ModalController,NavController } from '@ionic/angular';
// import { AmazingTimePickerService } from 'amazing-time-picker';
import * as moment from 'moment';

import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';


@Component({
  selector: 'app-select-time',
  templateUrl: './select-time.page.html',
  styleUrls: ['./select-time.page.scss'],
})
export class SelectTimePage implements OnInit {
  @Input() date_selected: any;

  
  viewTitle: string;

  current_date: any = moment().format('YYYY-DD-MM');

  myDateStart: any;
  myDateEnd: any;
  
  event = {
    title: 'Booked!',
    desc: '',
    startTime: null,
    endTime: null,
    allDay: true,
    t_start: '',
    t_end: '',
    booking_date: '',
  };
 
  modalReady = false;

  test: any;

  
  constructor(
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    // private atp: AmazingTimePickerService,
    private router: Router,
    private route: ActivatedRoute,
    private alertCtrl: AlertController 
  ) { }

  ngOnInit() {
  }
  backs() {
    this.navCtrl.back();
  }


  ionViewWillEnter(){

    this.route.queryParams.subscribe((params: any) => {

      this.date_selected = new Date(params.booked_date);

      console.log(params);
      // if (params) {
      //   let queryParams = JSON.parse(params);
      //   console.log(queryParams)
      // }
   

    // this.date_selected = new Date(this.date_selected);

    var a = moment(this.date_selected).format('lll')
    // this.myDateStart = a.substr(0, 13)
    // this.myDateEnd = a.substr(0, 13)

    // console.log(this.myDateStart)

    this.viewTitle = new Date(this.date_selected).toDateString();

    // this.event.booking_date = this.viewTitle.substr(4);

    this.event.booking_date = new Date(this.date_selected).toLocaleDateString();

    // this.date_selected = new Date(this.date_selected);

    this.event.startTime = this.date_selected;

    // let currentDate = new Date();
    // let time = currentDate.getHours() + ":" + currentDate.getMinutes()
    // console.log(time);
  });
    
  }


  ngAfterViewInit() {
    setTimeout(() => {
      this.modalReady = true;      
    }, 0);
  }
 
 async save() {

    // var param = {
    //   sid: localStorage.getItem('sid'),
    //   booking_date: this.event.booking_date,
    //   start: this.event.startTime.toLocaleDateString(),
    //   end: this.event.endTime.toLocaleDateString(),
    //   t_start: this.event.t_start,
    //   t_end: this.event.t_end,
    //   description: this.event.desc
    // }



    // console.log(param)
    // this.modalCtrl.dismiss({event: this.event})


    if(this.event.t_start == this.event.t_end){

      // console.log('same!')

      const alert = await this.alertCtrl.create({
        header: 'Look4Lokal',
        message: 'You input same time!',
        mode: 'ios',
        buttons: [
           {
            text: 'Ok',
            handler: () => {

            }
          }
        ]
      });

      await alert.present();

    }else {

      // console.log('not same!')

      localStorage.setItem('booked', JSON.stringify(this.event))

        const param: NavigationExtras = {
          queryParams: {
           booked: this.event
    
          }
        };
    
        this.router.navigate(['tabs/home/payment'], param);

      console.log(this.event)

    }


   

  }
 
  // onViewTitleChanged(title) {
  //   this.viewTitle = title;
  // }
 
  // onTimeSelected(ev) {    
  //   this.event.startTime = new Date(ev.selectedTime);
  // }
 
  close() {
    // this.modalCtrl.dismiss();
  }



  timepickerStart($event){

    var aStart = moment($event.detail.value).format('hh:mm A')

    var aDate = moment(this.date_selected).format('lll')

   
    var a = new Date(`${aDate.substr(0, 13)}${aStart}`)

    console.log(a)

    this.event.startTime = a;

     this.event.t_start = new Date($event.detail.value).toLocaleTimeString()

  }


  timepickerEnd($event){

    var aEnd = moment($event.detail.value).format('hh:mm A')

    var aDate = moment(this.date_selected).format('lll')

   
    var a = new Date(`${aDate.substr(0, 13)}${aEnd}`)

    console.log(a)

    this.event.endTime = a;

    this.event.t_end = new Date($event.detail.value).toLocaleTimeString()

  }


  tConvert (time) {
    // Check correct time format and split into components
    time = time.toString ().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
  
    if (time.length > 1) { // If time format correct
      time = time.slice (1);  // Remove full string match value
      time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
      time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    return time.join (''); // return adjusted time or original string
  }


  
}


