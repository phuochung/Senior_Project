import { CurrencyHelper } from './../../helpers/currency-helper';
import { DeliveryDeclinePage } from './../delivery-decline/delivery-decline';
import { DeliveryHelper } from './../../helpers/delivery-helper';
import { DeliveryStatus } from './../../app/constants';
import { Component } from '@angular/core';
import { NavParams, NavController } from 'ionic-angular';

@Component({
  selector: 'page-delivery-details',
  templateUrl: 'delivery-details.html'
})
export class DeliveryDetailsPage {
  item: any;
  currencyHelper = CurrencyHelper;

  constructor(
    private deliveryHelper: DeliveryHelper,    
    public navCtrl: NavController,
    public navParams: NavParams) {
      this.item = navParams.get('item');
  }

  accept(event: Event, item: any) {
    this.deliveryHelper.acceptItem(item);
    event.stopPropagation();
  }

  decline(event: Event, item: any) {
    this.navCtrl.push(DeliveryDeclinePage, {
      item: item
    })
    event.stopPropagation();
  }

  isSubmitted(item){
    return item.status == DeliveryStatus.Submitted
  }
}
