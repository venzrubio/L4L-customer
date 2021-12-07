import { Component, OnInit } from '@angular/core';
import { CalendarComponentOptions } from 'ion2-calendar'
@Component({
  selector: 'app-calendar2',
  templateUrl: './calendar2.page.html',
  styleUrls: ['./calendar2.page.scss'],
})
export class Calendar2Page implements OnInit {
  date: string;
  type: 'string';
  dateMulti: string[];
  dateRange: { from: string; to: string; };
   
  optionsMulti: CalendarComponentOptions = {
    pickMode: 'multi'
  };
  optionsRange: CalendarComponentOptions = {
    pickMode: 'range'
  };
  
  constructor() { }

  ngOnInit() {
  }

  onChange($event) {
    console.log($event);
  }
  
}
