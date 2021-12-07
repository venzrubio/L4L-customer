import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StoreInfosPageRoutingModule } from './store-infos-routing.module';

import { StoreInfosPage } from './store-infos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StoreInfosPageRoutingModule
  ],
  declarations: [StoreInfosPage]
})
export class StoreInfosPageModule {}
