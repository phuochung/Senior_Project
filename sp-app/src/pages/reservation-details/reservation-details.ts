import { ReservationDeclinePage } from './../reservation-decline/reservation-decline';
import { ReservationHelper } from './../../helpers/reservation-helper';
import { ReservationStatus } from './../../app/constants';
import { Component, OnInit } from '@angular/core';
import { NavParams, NavController } from 'ionic-angular';

@Component({
  selector: 'page-reservation-details',
  templateUrl: 'reservation-details.html'
})
export class ReservationDetailsPage implements OnInit {
  item: any;

  constructor(
    private reservationHelper: ReservationHelper,
    public navCtrl: NavController,
    public navParams: NavParams) {
      this.item = navParams.get('item');
  }

  ngOnInit() {
  }

  accept(event: Event, item: any) {
    this.reservationHelper.acceptItem(item);
    event.stopPropagation();
  }

  decline(event: Event, item: any) {
    this.navCtrl.push(ReservationDeclinePage, {
      item: item
    })
    event.stopPropagation();
  }

  isSubmitted(item){
    return item.status == ReservationStatus.Submitted
  }

}
