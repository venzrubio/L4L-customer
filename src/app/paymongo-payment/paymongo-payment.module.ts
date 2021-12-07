import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PaymongoPaymentPageRoutingModule } from './paymongo-payment-routing.module';

import { PaymongoPaymentPage } from './paymongo-payment.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PaymongoPaymentPageRoutingModule
  ],
  declarations: [PaymongoPaymentPage]
})
export class PaymongoPaymentPageModule {}
