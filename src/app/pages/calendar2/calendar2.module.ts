import { NgModule,LOCALE_ID  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { Calendar2PageRoutingModule } from './calendar2-routing.module';
import { CalendarModule } from 'ion2-calendar';
import { Calendar2Page } from './calendar2.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Calendar2PageRoutingModule,

  RouterModule.forChild([
    {
      path: '',
      component: Calendar2Page
    }
  ]),
  CalendarModule
],
  declarations: [Calendar2Page],
  providers: [{ provide: LOCALE_ID, useValue: 'zh-CN' }]
})
export class Calendar2PageModule {}
