import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Calendar2Page } from './calendar2.page';

const routes: Routes = [
  {
    path: '',
    component: Calendar2Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Calendar2PageRoutingModule {}
