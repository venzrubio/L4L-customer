
import { Component, AfterViewInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
// import { AmazingTimePickerService } from 'amazing-time-picker';
import * as moment from 'moment';



@Component({
  selector: 'app-cal-modal',
  templateUrl: './cal-modal.page.html',
  styleUrls: ['./cal-modal.page.scss'],
})
export class CalModalPage implements AfterViewInit  {

  @Input() date_selected: any;

  // calendar = {
  //   mode: 'month',
  //   currentDate: new Date()
  // };
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

  
 
  constructor(private modalCtrl: ModalController,
    ) { }
 
  ionViewWillEnter(){

    this.date_selected = new Date(this.date_selected);

    this.myDateStart = moment(this.date_selected).format();
    this.myDateEnd = moment(this.date_selected).format();

    console.log(this.myDateStart)

    this.viewTitle = new Date(this.date_selected).toDateString();

    // this.event.booking_date = this.viewTitle.substr(4);

    this.event.booking_date = new Date(this.date_selected).toLocaleDateString();

    // this.date_selected = new Date(this.date_selected);

    this.event.startTime = this.date_selected;

    // let currentDate = new Date();
    // let time = currentDate.getHours() + ":" + currentDate.getMinutes()
    // console.log(time);
    
    
  }


  ngAfterViewInit() {
    setTimeout(() => {
      this.modalReady = true;      
    }, 0);
  }
 
  save() {    
    this.modalCtrl.dismiss({event: this.event})

    // console.log(this.event)

  }
 
  // onViewTitleChanged(title) {
  //   this.viewTitle = title;
  // }
 
  // onTimeSelected(ev) {    
  //   this.event.startTime = new Date(ev.selectedTime);
  // }
 
  close() {
    this.modalCtrl.dismiss();
  }



  timepickerStart($event){
    

    var a = new Date($event.detail.value)

    console.log(a)

    this.event.startTime = a;

     this.event.t_start = new Date($event.detail.value).toLocaleTimeString()

    //  this.event.t_start = new Date($event.detail.value).toLocaleTimeString()

    //  console.log(this.event.t_start)


    // const amazingTimePicker = this.atp.open({
    //   theme: 'material-orange',
    //   arrowStyle: {
    //       background: 'orange',
    //       color: 'white'
    //   }
    // });
  
    // // console.log(this.atp);
  
  
    // amazingTimePicker.afterClose().subscribe(time => {
    //   console.log(this.tConvert(time));

    //   this.event.time.start_time = this.tConvert(time)
  
    // });


  }


  timepickerEnd($event){

    var a = new Date($event.detail.value)

    console.log(a)

    this.event.endTime = a;

    this.event.t_end = new Date($event.detail.value).toLocaleTimeString()
    // const amazingTimePicker = this.atp.open({
    //   theme: 'material-orange',
    //   arrowStyle: {
    //       background: 'orange',
    //       color: 'white'
    //   }
    // });
  
    // // console.log(this.atp);
  
  
    // amazingTimePicker.afterClose().subscribe(time => {
    //   console.log(this.tConvert(time));


    //   this.event.time.end_time = this.tConvert(time)
  
    // });


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
