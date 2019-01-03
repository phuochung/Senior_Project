import { Platform, NavController, Tabs, Events } from 'ionic-angular';
import { Component, ViewChild } from '@angular/core';
import { ReservationListPage } from '../reservation-list/reservation-list';
import { DeliveryListPage } from '../delivery-list/delivery-list';

@Component({
  selector: 'page-request-list',
  templateUrl: 'request-list.html'
})
export class RequestListPage {
  @ViewChild('mainTabs') tabRef: Tabs;
  tab1Root = DeliveryListPage;
  tab2Root = ReservationListPage;
  constructor(
  ) {    
  }

}
