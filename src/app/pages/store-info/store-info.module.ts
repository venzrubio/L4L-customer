import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StoreInfoPageRoutingModule } from './store-info-routing.module';

import { StoreInfoPage } from './store-info.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StoreInfoPageRoutingModule
  ],
  declarations: [StoreInfoPage]
})
export class StoreInfoPageModule {}
