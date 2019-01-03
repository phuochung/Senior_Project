import { ReservationStatus } from './../../app/constants';
import { ReservationHelper } from './../../helpers/reservation-helper';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-reservation-decline',
  templateUrl: 'reservation-decline.html',
})
export class ReservationDeclinePage {
  item: any;

  constructor(
    private reservationHelper: ReservationHelper,
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
    this.item = navParams.get('item');
  }

  isSubmitted(item){
    return item.status == ReservationStatus.Submitted;
  }

  goBack() {
    this.navCtrl.pop();
  }

  doDecline(item){
    this.reservationHelper.declineItem(item);
  }

}
