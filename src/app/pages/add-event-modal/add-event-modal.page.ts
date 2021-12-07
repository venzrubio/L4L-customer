import { Component, OnInit } from '@angular/core';
import { NavController, NavParams ,ModalController} from '@ionic/angular';
import {  } from '@ionic/core';

import * as moment from 'moment'
import { of } from "rxjs/observable/of";
@Component({
  selector: 'app-add-event-modal',
  templateUrl: './add-event-modal.page.html',
  styleUrls: ['./add-event-modal.page.scss'],
})
export class AddEventModalPage implements OnInit {

  event = {
    startTime: new Date().toISOString(),
    endTime: new Date().toISOString(),
    allDay: false,
    room : {}
  };
  minDate = new Date().toISOString();
  rooms$ = of([{ id: "room1", name: "room1" }, { id: "room2", name: "room2" }, { id: "room3", name: "room3" }])

  constructor(
    public navCtrl: NavController,
    private navParams: NavParams,
    private modal: ModalController) {
    let preselectedDate = moment(this.navParams.get('selectedDay')).format();
    this.event.startTime = preselectedDate;
    this.event.endTime = preselectedDate;
  }
  ngOnInit() {
  }

  cancel() {
    this.modal.dismiss();
  }

  save() {
    this.modal.dismiss(this.event);
  }

  blockDay($event) {
    console.log($event)
  }

  optionSelected($event) {
    console.log($event)
    this.event.room = $event
  }
}

