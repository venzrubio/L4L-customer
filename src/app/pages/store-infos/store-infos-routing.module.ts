import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StoreInfosPage } from './store-infos.page';

const routes: Routes = [
  {
    path: '',
    component: StoreInfosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StoreInfosPageRoutingModule {}
