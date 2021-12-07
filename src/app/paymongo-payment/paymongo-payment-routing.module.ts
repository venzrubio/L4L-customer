import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PaymongoPaymentPage } from './paymongo-payment.page';

const routes: Routes = [
  {
    path: '',
    component: PaymongoPaymentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaymongoPaymentPageRoutingModule {}
