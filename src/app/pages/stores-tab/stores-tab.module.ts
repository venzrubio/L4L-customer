import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StoresTabPageRoutingModule } from './stores-tab-routing.module';

import { StoresTabPage } from './stores-tab.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StoresTabPageRoutingModule
  ],
  declarations: [StoresTabPage]
})
export class StoresTabPageModule {}
