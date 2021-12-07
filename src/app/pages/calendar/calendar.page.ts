import { Component, ViewChild, OnInit, Inject, LOCALE_ID } from '@angular/core';
import { CalendarComponent } from 'ionic2-calendar';
import { AlertController, ModalController,NavController } from '@ionic/angular';
import { formatDate } from '@angular/common';
import { CalModalPage } from '../cal-modal/cal-modal.page';
import { ApiService } from 'src/app/services/api.service';
// import { AmazingTimePickerService } from 'amazing-time-picker';
import { Router, NavigationExtras } from '@angular/router';
import { CartService } from 'src/app/services/cart.service';



@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.page.html',
  styleUrls: ['./calendar.page.scss'],
})
export class CalendarPage implements OnInit {

  eventSource: any = [];
  viewTitle: string;
 
  calendar: any = {}

  dateSelected: any;

 
  selectedDate: Date;
  clickDate: any;
  block: boolean;
  showTime: any;
  showAdd: boolean;
 
  @ViewChild(CalendarComponent) myCal: CalendarComponent;
 

  constructor(private alertCtrl: AlertController,
    @Inject(LOCALE_ID) private locale: string,
    private modalCtrl: ModalController,
    private navCtrl: NavController,
    // private atp: AmazingTimePickerService,
    public api: ApiService,
    private router: Router,
    public cartService: CartService) { }

  ngOnInit() {

  }

  ionViewWillEnter(){

    this.eventSource = [];
    
    this.calendar = {
    mode: 'month',
    currentDate: new Date()
  };


 this.checkBooking();



  // console.log(this.calendar)

  }


  // Change current month/week/day
  next() {
    this.myCal.slideNext();
    console.log('next')

  }
 
  back() {
    this.myCal.slidePrev();
    console.log('back')

  }
 
  // Selected date reange and hence title changed
  onViewTitleChanged(title) {
    this.viewTitle = title;
  }
 
  // Calendar event was clicked
  async onEventSelected(event) {
    // Use Angular date pipe for conversion
    // let start = formatDate(event.startTime, 'medium', this.locale);
    // let end = formatDate(event.endTime, 'medium', this.locale);
 
    // const alert = await this.alertCtrl.create({
    //   header: event.title,
    //   subHeader: event.desc,
    //   mode: 'ios',
    //   message: 'From: ' + start + '<br><br>To: ' + end,
    //   buttons: ['OK'],
    // });
    // alert.present();

    console.log(event)
  }
  markDisabled = (date: Date) => {
    var current = new Date();
    return date < current;
};
  // createRandomEvents() {
  //   var events = [];
  //   for (var i = 0; i < 50; i += 1) {
  //     var date = new Date();
  //     var eventType = Math.floor(Math.random() * 2);
  //     var startDay = Math.floor(Math.random() * 90) - 45;
  //     var endDay = Math.floor(Math.random() * 2) + startDay;
  //     var startTime;
  //     var endTime;
  //     if (eventType === 0) {
  //       startTime = new Date(
  //         Date.UTC(
  //           date.getUTCFullYear(),
  //           date.getUTCMonth(),
  //           date.getUTCDate() + startDay
  //         )
  //       );
  //       if (endDay === startDay) {
  //         endDay += 1;
  //       }
  //       endTime = new Date(
  //         Date.UTC(
  //           date.getUTCFullYear(),
  //           date.getUTCMonth(),
  //           date.getUTCDate() + endDay
  //         )
  //       );
  //       events.push({
  //         title: 'All Day - ' + i,
  //         startTime: startTime,
  //         endTime: endTime,
  //         allDay: true,
  //       });
  //     } else {
  //       var startMinute = Math.floor(Math.random() * 24 * 60);
  //       var endMinute = Math.floor(Math.random() * 180) + startMinute;
  //       startTime = new Date(
  //         date.getFullYear(),
  //         date.getMonth(),
  //         date.getDate() + startDay,
  //         0,
  //         date.getMinutes() + startMinute
  //       );
  //       endTime = new Date(
  //         date.getFullYear(),
  //         date.getMonth(),
  //         date.getDate() + endDay,
  //         0,
  //         date.getMinutes() + endMinute
  //       );
  //       events.push({
  //         title: 'Event - ' + i,
  //         startTime: startTime,
  //         endTime: endTime,
  //         allDay: false,
  //       });
  //     }
  //   }
  //   this.eventSource = events;

  //   console.log(this.eventSource)
  // }
 
  removeEvents() {
    this.eventSource = [];
  }

  async openCalModal() {
    const modal = await this.modalCtrl.create({
      component: CalModalPage,
      cssClass: 'cal-modal',
      componentProps: {
        date_selected: this.dateSelected
      },
      backdropDismiss: false
    });
   
    await modal.present();
   
    modal.onDidDismiss().then((result) => {

      console.log(result)

      if (result.data && result.data.event) {
        let event = result.data.event;
        if (event.allDay) {

          // let start = event.startTime;
          // event.startTime = new Date(
          //   Date.UTC(
          //     start.getUTCFullYear(),
          //     start.getUTCMonth(),
          //     start.getUTCDate()
          //   )
          // );
          // event.endTime = new Date(
          //   Date.UTC(
          //     start.getUTCFullYear(),
          //     start.getUTCMonth(),
          //     start.getUTCDate()
          //   )
          // );
        }


        // this.eventSource.push(result.data.event);
        // this.myCal.loadEvents();

        localStorage.setItem('booked', JSON.stringify(result.data.event))

        // console.log(this.eventSource);

        // const param: NavigationExtras = {
        //   queryParams: {
        //    booked: result.data.event
    
        //   }
        // };
    
        // this.router.navigate(['tabs/cart/payment'], param);


        var param = {
          sid: localStorage.getItem('sid'),
          booking_date: result.data.event.booking_date,
          start: result.data.event.startTime.toLocaleDateString(),
          end: result.data.event.endTime.toLocaleDateString(),
          t_start: result.data.event.t_start,
          t_end: result.data.event.t_end,
          description: result.data.event.desc
        }

        console.log(param)
      
      
        this.api.post('stores/saveBooking', param).subscribe((res)=>{

         
          this.checkBooking();

          // this.myCal.loadEvents();

        })
       
      }
    });
  }
    
  // onTimeSelected(ev) {    
  //   // this.event.startTime = new Date(ev);

  //   console.log(ev)
  // }

 checkBooking(){

  var params = {sid: localStorage.getItem('sid')}

  this.api.post('stores/getBooking', params).subscribe((res: any)=>{

    // console.log(res);

    var a = res.data

    // this.eventSource = res.data;

    for(let i = 0; i < a.length; i++){


      a[i].startTime = new Date(a[i].start)
      a[i].endTime = new Date(a[i].end)


      // console.log(a[i])

      this.eventSource.push(a[i]);

       this.myCal.loadEvents();
    }


   
  })

 }


  save() {
  // this.eventSource = [];

  let currentDate = new Date();
let time = currentDate.getHours() + ":" + currentDate.getMinutes()
console.log(time);

 

  // const amazingTimePicker = this.atp.open({
  //   theme: 'material-orange',
  //   arrowStyle: {
  //       background: 'orange',
  //       color: 'white'
  //   }
  // });

  // console.log(this.atp);


  // amazingTimePicker.afterClose().subscribe(time => {
  //   console.log(this.tConvert(time));


  //   var a = {
  //   title: 'Booked!',
  //   desc: '',
  //   startTime: this.dateSelected,
  //   endTime: null,
  //   allDay: false
  //   }
  
  
  //   console.log(this.dateSelected)


  //   if (a.allDay == false) {
  //     let start = a.startTime;
  //     a.startTime = new Date(
  //       Date.UTC(
  //         start.getUTCFullYear(),
  //         start.getUTCMonth(),
  //         start.getUTCDate()
  //       )
  //     );
  //     a.endTime = new Date(
  //       Date.UTC(
  //         start.getUTCFullYear(),
  //         start.getUTCMonth(),
  //         start.getUTCDate()
  //       )
  //     );
  //   }

  //   this.eventSource.push(a);
  //   this.myCal.loadEvents();

  //   console.log(this.eventSource);


  // });




   
  }


  passedDate(selectedDate){
    const date = new Date();

    console.log(selectedDate);

    var a = new Date(selectedDate).setHours(0);

    this.dateSelected = new Date(a);


    this.clickDate = new Date(a).toLocaleDateString();

    
    var b = this.eventSource.findIndex(x => x.booking_date === this.clickDate)

    console.log(b)

    if(b == -1){

      this.showTime = [];

      this.showAdd = false;

    }else {

      this.showTime = this.eventSource[b].t_start +' - '+ this.eventSource[b].t_end;


      this.showAdd = true;

      console.log(this.showTime);

    }

   

    // console.log(this.clickDate);
    // console.log(selectedDate)

      // this.dateSelected = new Date(
      //   // Date.UTC(
      //   //   this.dateSelected.getUTCFullYear(),
      //   //   this.dateSelected.getUTCMonth(),
      //   //   this.dateSelected.getUTCDate(),
      //   // )
      // );

      // console.log(this.dateSelected)

    if(selectedDate < date){
      this.block = true;
    }
    else { 
      this.block = false;
    }
  }


  cancelBook(){

    this.eventSource = [];


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

    backs() {
      this.navCtrl.back();
    }

    selecttime() {

       const param: NavigationExtras = {
          queryParams: {
           booked_date: this.dateSelected
    
          }
        };


      this.router.navigate(['/tabs/home/select-time'], param);


    }
   
}
