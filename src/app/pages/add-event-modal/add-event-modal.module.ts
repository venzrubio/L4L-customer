import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddEventModalPageRoutingModule } from './add-event-modal-routing.module';

import { AddEventModalPage } from './add-event-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddEventModalPageRoutingModule
  ],
  declarations: [AddEventModalPage]
})
export class AddEventModalPageModule {}
