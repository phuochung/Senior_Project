import { DeliveryHelper } from './../../helpers/delivery-helper';
import { DeliveryStatus } from './../../app/constants';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-delivery-decline',
  templateUrl: 'delivery-decline.html',
})
export class DeliveryDeclinePage {
  item: any;

  constructor(
    private deliveryHelper: DeliveryHelper,
    public navCtrl: NavController, 
    public navParams: NavParams
  ) {
    this.item = navParams.get('item');
  }

  isSubmitted(item){
    return item.status == DeliveryStatus.Submitted;
  }

  goBack() {
    this.navCtrl.pop();
  }

  doDecline(item){
    this.deliveryHelper.declineItem(item);
  }
}
